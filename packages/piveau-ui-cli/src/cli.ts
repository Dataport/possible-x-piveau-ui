#!/usr/bin/env node
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { glob } from 'glob'
import { cac } from 'cac'
import colors from 'picocolors'
import * as z from 'zod'
import { fromZodError } from 'zod-validation-error'
import { createLogger } from './logger.js'
import { VERSION } from './constants.js'

import { configSchema } from '@piveau/piveau-hub-ui-modules/configSchema'

const startTime = performance.now()
const logger = createLogger('info', { prefix: '[piveau-ui-cli]' })
const cli = cac('piveau-ui-cli')
const configFileSchema = z.string().default('./config/user-config.+(js|ts|cjs|mjs)')

cli
  .command('[file]', 'Validate user config file')
  .alias('v')
  .alias('validate')
  .option('-i, --inspect', 'Inspect resolved config', { default: false })
  .action(async (file: string, options) => {
    // logger.info('Validating config file...', { timestamp: true })

    const parsed = configFileSchema.safeParse(file || undefined)
    if (!parsed.success) {
      console.error(parsed.error)
      process.exit(1)
    }
    const configPath = parsed.data
    const resolvedConfigPath = path.resolve(configPath)

    // check if file exists
    const foundFiles = glob.sync(resolvedConfigPath)
    if (foundFiles.length === 0) {
      logger.error(`Could not find config file at ${colors.bold(configPath)}`)
      process.exit(1)
    }

    // Take first file
    const userConfigFilePath = foundFiles[0]

    const config = await import(userConfigFilePath).catch((err) => {
      logger.error(err)
      logger.error('Failed to load config schema. Did you make sure that the config file exports glueConfig?')
      process.exit(1)
    })

    const parsedConfig = configSchema.safeParse(config.glueConfig)

    const startupDurationString = startTime
      ? colors.dim(
        `parsed in ${colors.reset(
          colors.bold(Math.ceil(performance.now() - startTime)),
        )} ms`,
      )
      : ''

    logger.info(
    `\n  ${colors.cyan(
      `${colors.bold('piveau-ui-cli')} v${VERSION}`,
    )}  ${startupDurationString}\n`,
    { clear: false },
    )

    if (!parsedConfig.success) {
      const numberOfErrors = parsedConfig.error.issues.length
      const redArrow = colors.red('➜ ')
      logger.error(fromZodError(parsedConfig.error, {
        prefix: colors.red(`Found ${colors.bold(numberOfErrors)} errors in ${colors.bold(configPath)}\n\n  ${redArrow} `),
        prefixSeparator: '',
        issueSeparator: `\n\n  ${redArrow} `,
      }).message)
      process.exit(1)
    }
    console.info(colors.green('✓ Config file is valid!'))

    if (options.inspect) {
      const prettifiedConfig = JSON.stringify(parsedConfig.data, null, 2)
      console.info(colors.bold('Resolved config:\n'))
      console.log(prettifiedConfig)
    }
  })

cli.help()
cli.parse()
