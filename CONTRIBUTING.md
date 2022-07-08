# Contributing to edp-header-footer

As a contributor, here are the guidelines to follow.

## Branches

There are two branches in this project that have a special role, These are
* `master`: commits to this branch will trigger a release on the `latest` tag (corresponds to `npm install @piveau/piveau-hub-ui-modules`)
* `develop`: commits to this branch will trigger a release on the `develop` tag (corresponds to `npm install @piveau/piveau-hub-ui-modules@develop`)

This allows us for a flow very similar to the git-flow:
* in general, do not push directly into `master`. Do merge requests into it instead
* it is recommended to first implement  test code changes on the `develop` branch and then merging it into `master` when ready.
* Issues/tickets should be worked on dedicated branches (and merged into `develop`/`master` when ready)

## Coding rules

### Source code

To ensure consistency and quality throughout the source code, all code modifications must have:
- No [linting](#lint) errors
- A [test](#tests) for every possible case introduced by your code change
- **100%** test coverage
- [Valid commit message(s)](#commit-message-guidelines)
- Documentation for new features
- Updated documentation for modified features

### Commit message guidelines

#### Atomic commits

If possible, make [atomic commits](https://en.wikipedia.org/wiki/Atomic_commit), which means:
- a commit should contain exactly one self-contained functional change
- a functional change should be contained in exactly one commit
- a commit should not create an inconsistent state (such as test errors, linting errors, partial fix, feature with documentation etc...)

A complex feature can be broken down into multiple commits as long as each one maintains a consistent state and consists of a self-contained change.

#### Commit message format

Note: contributors **must** follow the commit message format. Maintaining the commit message format ensures that releases will be tagged with the correct version and changelogs will be generated as expected

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```commit
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

The **footer** can contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages).

#### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

#### semantic versioning
Developers rely on our code. When we make updates, we want to respect this trust by accurately communicating the scope of any future changes.
A package with version 1.2.3 seen with semantic versioning
    1. Major changes: Changes that break backward compatibility
    2. Minor changes: Backward compatible new features
    3. Patch changes: Backward compatible bug fixes

#### Type

The type must be one of the following:

| Type         | Description                                                                                                 |
|--------------|-------------------------------------------------------------------------------------------------------------|
| **build**    | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)         |
| **ci**       | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| **docs**     | Documentation only changes                                                                                  |
| **feat**     | Will be used to trigger a Minor release                                                                     |
| **fix**      | Will be used to trigger a Patch release                                                                     |
| **perf**     | A code change that improves performance                                                                     |
| **refactor** | A code change that neither fixes a bug nor adds a feature                                                   |
| **style**    | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)      |
| **test**     | Adding missing tests or correcting existing tests                                                           |

#### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

#### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

#### Footer
The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

#### Examples

```git commit -m
fix(pencil): stop graphite breaking when too much pressure applied
```

```git commit -m
fix(core): remove deprecated and defunct wtf* apis" -m "These apis have been deprecated in v8, so they should stick around till v10.
``` 

```git commit -m
feat(pencil): add 'graphiteWidth' option

Fix #42
```

```git commit -m
perf(pencil): remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed.

The default graphite width of 10mm is always used for performance reasons.
```

## Automation with CI
semantic-release is meant to be executed on the CI environment after every successful build on the release branch. This way no human is directly involved in the release process and the releases are guaranteed to be
.
# Triggering a release
For each new commit added to one of the release branches (for example: master, develop), with git push or by merging a pull request or merging from another branch, a CI build is triggered and runs the semantic-release command to make a release if there are codebase changes since the last release that affect the package functionalities.

you find your module in paca npm registry [piveau-hub-ui-modules](https://paca.fokus.fraunhofer.de/#browse/browse:npm-hosted:%40piveau%2Fpiveau-hub-ui-modules)
# Changelog
For each release for develop or master branch, a [docs/CHANGELOG.md](https://gitlab.fokus.fraunhofer.de/piveau/hub/piveau-hub-ui-modules/-/blob/master/docs/CHANGELOG.md) will be created or updated.
