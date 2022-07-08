# piveau-hub-ui-modules

This is a space to develop Vanilla piveau-hub-ui components. 
This project can be published as an npm package to our npm registry
which can then be used in Piveau based projects to import the
required parts.

## Module development

We are developing an npm package named `@piveau/piveau-hub-ui-modules`
Component development takes place in the `src/modules` folder and
all components that should be part of our npm package must be 
exported from there.

The rest of the source code (outside `src/modules`) is a test app, which is a copy of Data Europa
Piveau-Hub-UI and can be run with `npm run serve`. The basic idea is to take parts from 
the test app and isolate them in `src/modules`, then import them back into the test 
app just like you would from the published package:

```
import { MyComponent } from '@piveau/piveau-hub-ui-modules';
```

The workflow is as follows:

  * Develop your component in `src/modules`
  * Export the component in `src/modules/index.ts`
  * Import the component in the test app from `@piveau/piveau-hub-ui-modules`
  * When a new version should be published, increase the version number in `package.json` and run `npm run deploy` (you have to be logged into our paca npm registry)

In order for imports from `@piveau/piveau-hub-ui-modules` in the test-app to work, that package must be accessible in the node_modules folder.
There are two ways to get achieve this:

  1. Executing `npm run link-module` creates a symlink to the `src/modules` folder in node_modules.
  2. Executing `npm run localdeploy` creates a compiled version of the modules folder in `dist` and copies it into node_modules`.

The advantage of option 2 is that the package in node_modules is exactly the same as the published version will be.
However development with that option requires repeated `npm run build` to update the package for the test-app.
Option 1 does not require rebuilding so the development experience is simpler and faster.

## Project setup
```
npm install
```

### Test app compiles and hot-reloads for development
```
npm run serve
```

### Compiling modules
```
npm run build
```

or to compile and also add a copy of the compiled modules in node_modules:

```
npm run localdeploy
```

### Creating a symlink of the module in node_modules
```
npm run link-module
```

### Publishing modules
```
npm run deploy
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Automation with CI
semantic-release is meant to be executed on the CI environment after every successful build on the release branch. This way no human is directly involved in the release process and the releases are guaranteed to be
.
# Triggering a release
For each new commit added to one of the release branches (for example: master, develop), with git push or by merging a pull request or merging from another branch, a CI build is triggered and runs the semantic-release command to make a release if there are codebase changes since the last release that affect the package functionalities.

# Changelog
For each release, a docs/CHANGELOG.md will be created or updated.
