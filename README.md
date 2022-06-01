# piveau-hub-ui-modules

This is a space to develop Vanilla piveau-hub-ui components. 
This project can be published as an npm package to our npm registry
which can then be used in Piveau based projects to import the
required parts.

Component development takes place in the `src/modules` folder and
all importable components should be exported from there.
The rest of the source code is a test app, which is a copy of Data Europa
Piveau-Hub-UI and can be run with `npm run serve`. The basic idea is to take parts from 
the test app and isolate them in `src/modules`, then import them back into the test 
app just like you would from the published package:

```
import { MyComponent } from '@piveau/piveau-hub-ui-modules';
```

The workflow is as follows:

  * Develop your component in `src/modules`
  * Export the component in `src/modules/index.js`
  * Import the component in the test app
  * run `npm run build:lib`. This creates a compiled version of the modules folder in `dist`. It also file-copies the result into `node_modules` so the import into the test app works.
  * When a new version should be published, increase the version number in `package.json` and run `npm publish` (you have to be logged into our paca npm registry)

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
npm run build:lib
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
