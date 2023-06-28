import prompts from 'prompts'
import semver from 'semver'
import colors from 'picocolors'
import { publint } from 'publint'
import { printMessage } from 'publint/utils'
import {
  args,
  getPackageInfo,
  getVersionChoices,
  isDryRun,
  packagesFolder,
  run,
  runIfNotDry,
  step,
  updateVersion,
} from './utils'
import type { release as def } from './types'

import { logRecentCommits, updateTemplateVersions } from './releaseUtils'
import fs from "fs";

export const release: typeof def = async ({
  repo,
  packages,
  logChangelog,
  generateChangelog,
  toTag,
  getPkgDir,
}) => {
  let targetVersion: string | undefined

  const selectedPkg: string
    = packages.length === 1
      ? packages[0]
      : (
          await prompts({
            type: 'select',
            name: 'pkg',
            message: 'Select package to release',
            choices: packages.map(i => ({ value: i, title: i })),
          })
        ).pkg

  if (!selectedPkg)
    return

  await logChangelog(selectedPkg)

  const { pkg, pkgPath, pkgDir } = getPackageInfo(selectedPkg, getPkgDir)

  const messages = await publint({ pkgDir })

  if (messages.length) {
    for (const message of messages) console.log(printMessage(message, pkg))
    const { yes }: { yes: boolean } = await prompts({
      type: 'confirm',
      name: 'yes',
      message: `${messages.length} messages from publint. Continue anyway?`,
    })
    if (!yes)
      process.exit(1)
  }

  if (!targetVersion) {
    const { release }: { release: string } = await prompts({
      type: 'select',
      name: 'release',
      message: `Select release type ${colors.dim(`(current: ${pkg.version})`)}`,
      choices: getVersionChoices(pkg.version),
    })

    if (release === 'custom') {
      const res: { version: string } = await prompts({
        type: 'text',
        name: 'version',
        message: 'Input custom version',
        initial: pkg.version,
      })
      targetVersion = res.version
    }
    else {
      targetVersion = release
    }
  }

  if (!semver.valid(targetVersion))
    throw new Error(`invalid target version: ${targetVersion}`)

  const tag = toTag(selectedPkg, targetVersion)

  if (targetVersion.includes('beta') && !args.tag)
    args.tag = 'beta'

  if (targetVersion.includes('alpha') && !args.tag)
    args.tag = 'alpha'

  const { yes }: { yes: boolean } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing ${pkg.name} ${colors.yellow(tag)} Confirm?`,
  })

  if (!yes)
    return

  // Ask confirmation for major version
  if (semver.major(targetVersion) > semver.major(pkg.version)) {
    const { yes }: { yes: boolean } = await prompts({
      type: 'confirm',
      name: 'yes',
      message: `Releasing major version ${colors.yellow(tag)} Confirm?`,
    })

    if (!yes)
      return
  }

  step('\nUpdating package version...')
  updateVersion(pkgPath, targetVersion)
  await generateChangelog(selectedPkg, targetVersion)

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `release: ${tag}`])
    await runIfNotDry('git', ['tag', tag])
  }
  else {
    console.log('No changes to commit.')
    return
  }

  step('\nPushing to GitHub...')
  await runIfNotDry('git', ['push', 'origin', `refs/tags/${tag}`])
  await runIfNotDry('git', ['push'])

  if (isDryRun) {
    console.log('\nDry run finished - run git diff to see package changes.')
  }
  else {
    console.log(
      colors.green(
        `
Pushed, publishing should start shortly on CI.
https://gitlab.fokus.fraunhofer.de/piveau/ui/${repo}/-/pipelines`,
      ),
    )
  }

  console.log()
}

const callRelease = (packages) => release({
  repo: 'piveau-ui',
  packages,
  toTag: (pkg, version) =>
    pkg === 'piveau-hub-ui-modules' ? `v${version}` : `${pkg}@${version}`,
  logChangelog: pkg => logRecentCommits(pkg),
  generateChangelog: async (pkgName) => {
    // if (pkgName === 'create-vite')
    //   await updateTemplateVersions()

    console.log(colors.cyan('\nGenerating changelog...'))
    const changelogArgs = [
      'conventional-changelog',
      '-p',
      'angular',
      '-i',
      'CHANGELOG.md',
      '-s',
      '-r 0',
      '--commit-path',
      '.',
    ]
    if (pkgName !== 'piveau-hub-ui-modules')
      changelogArgs.push('--lerna-package', pkgName)
    await run('npx', changelogArgs, { cwd: `packages/${pkgName}` })
  },
})

fs.readdir('packages',  (error, files) => {
  if (error) {
    console.error(error);
  } else {
    const packages = files.filter(file => { // Filter out directories
      return fs.statSync(`${packagesFolder}/${file}`).isDirectory();
    });
    callRelease(packages);
  }
});

