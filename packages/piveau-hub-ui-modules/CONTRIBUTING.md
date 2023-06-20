# Contributing to piveau-hub-ui-modules

### Basics

We are developing an npm package named `@piveau/piveau-hub-ui-modules`
Component development takes place in the `lib` folder and
all components that should be part of our npm package must be
exported from there.

You can test your components in consuming apps (for example, apps/modules-demo).
Any consuming app must have a dependency `@piveau/piveau-hub-ui-modules` in
its `package.json` and import components like this:

```
import { MyComponent } from '@piveau/piveau-hub-ui-modules';
```

### Development workflow

* Develop your component in `lib`
* Export the component in `lib/index.mjs` if it is not yet
* Import the component in your consuming app from `@piveau/piveau-hub-ui-modules`
* Merge your feature branch to the master branch (for now, no CI script will be triggered!)
* When a new version of the package should be published (for use outside of the monorepo), 
  run one of the following commands (from the monorepo root level):
  ```
  npm run release:patch
  npm run release:minor
  npm run release:major
  ```
  This results in a package build, a version increase (patch, minor or major) and
  an npm publish to the paca registry.


