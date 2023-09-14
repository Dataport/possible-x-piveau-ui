# Migration Guide (v4)

To make use of the latest `piveau-hub-ui-modules` version (4.x.x) in your project, apply the following changes to your piveau-hub-ui:

## 1. Update `package.json`

<details><summary>Open</summary>
<br>

_Note: Use the "@vue/compat" package for testing. There may be more dependencies to add / upgrade in your project!_

#### 1.1 Replace vue-cli commands in `package.json` and use Vite:

```js
  "scripts": {
    "dev": "npm run serve",
    "serve": "vite --host",
    "build": "vite build"
  },
```

#### 1.2 Upgrade piveau packages to Vue 3 compatible versions in `package.json`:

```js
"@piveau/piveau-hub-ui-modules": "4.x.x",
"@piveau/piveau-universal-piwik": "3.x.x",
```

#### 1.3 Upgrade Vue in `package.json`:

```js
"vue": "^3.1.0",
"@vue/compat": "^3.1.0",
```

#### 1.4 Upgrade other packages to Vue 3 compatible versions in `package.json`:

```js
"vite": "^4.0.3",
"vue-router": "^4.1.6",
"vuex": "^4.0.2",
"vee-validate": "^4.11.6",
"vue-meta": "^3.0.0-alpha.10",
```


#### 1.5 Add new Vue 3 compatible packages to `package.json`:

```js
"@aacassandra/vue3-progressbar": "^1.0.3",
"@vitejs/plugin-vue": "^4.0.0",
"@vitejs/plugin-vue-jsx": "^3.0.2",
"vue3-cookies": "^1.0.6",
"vue-select-3": "^1.0.1",
"vue-skeletor": "^1.0.6",
"vue3-click-away": "^1.2.4",
"vue3-step-progress": "^0.2.6",
"vue3-datepicker": "^0.3.4",
```

#### 1.6 Remove incompatible packages from `package.json`:

```js
"@piveau/dcatap-frontend": "x.x.x",
"@vitejs/plugin-vue2": "x.x.x",
"@vue/cli-plugin-babel": "x.x.x",
"@vue/cli-plugin-eslint": "x.x.x",
"@vue/cli-plugin-router": "x.x.x",
"@vue/cli-plugin-typescript": "x.x.x",
"@vue/cli-plugin-unit-jest": "x.x.x",
"@vue/cli-plugin-vuex": "x.x.x",
"@vue/compiler-sfc": "x.x.x",
"core-js": "x.x.x",
"skeleton-loader-vue": "x.x.x",
"vue-clickaway": "x.x.x",
"vue-select": "x.x.x",
"vue-step-progress": "x.x.x",
"vue2-datepicker": "x.x.x",
```
</details>


## 2. Update `main.ts`, `router.js` & `index.html`

<details><summary>Open</summary>
<br>

#### 2.1 `main.ts`

_Note: Replace all occurences of `Vue.xxx` by `app.xxx`!_

```js
import { createI18n } from 'vue-i18n'
import { createApp } from 'vue'

const app = createApp(App);

...

app.mount('#app');
```

#### 2.2 `router.js`

_Note: Base option was removed, use history!_

```js
import * as Router from 'vue-router';

...

const router = Router.createRouter({
  history: Router.createWebHistory(GLUE_CONFIG.routing.routerOptions.base),
  linkActiveClass: 'active',

  ...

});
```

#### 2.3 `index.html`

_Note: Move `index.html` into root directory!_


```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="shortcut icon" type="image/ico" href="/static/favicon.ico">
    <link rel="preload" type="text/css" href="/static/preload-styles/loading-animation.css" as="style">
    <link rel="preload" type="text/css" href="/static/fonts/material-icons.css" as="style">
    <link rel="stylesheet" href="/static/preload-styles/loading-animation.css">
    <link rel="stylesheet" href="/static/fonts/material-icons.css">
    <script type="module" src="/src/main.ts"></script>
    <title></title>
  </head>
  <body>
    <div id="app">
        <div class="spinner-container">
            <div class="spinner"></div>
        </div>
    </div>
  </body>
</html>
```
</details>


## 3. Replace `Vue.`

<details><summary>Open</summary>
<br>

```js
Vue.set(variable, property, value)    ==> variable[property] = value

Vue.extend()                          ==> defineComponent()

Vue.component()                       ==> app.component()

Vue.prototype.$env                    ==> process.env | import.meta.env

Vue.prototype.<globalProperty>        ==> app.config.globalProperties.<globalProperty>

Vue.i18n                              ==> this.i18n
```
</details>


## 4. ???

<details><summary>Open</summary>
<br>


</details>

## 5. Replace `vue.config.js` by `vite.config.ts`

<details><summary>Open</summary>
<br>

```ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { lstatSync } from 'node:fs';
import path from 'path';
import config from './config';

const isSymlink = (pkg: string) => {
  const packagePath = path.resolve('..', '..', 'node_modules', pkg);
  try {
    return lstatSync(packagePath).isSymbolicLink();
  } catch {
    return false;
  }
}

let buildMode;
if (process.env.NODE_ENV === 'production') {
  buildMode = process.env.BUILD_MODE === 'test' ? 'test' : 'build';
} else {
  buildMode = 'dev';
}

const buildConfig = {
  BASE_PATH: config[buildMode].assetsPublicPath,
  SERVICE_URL: config[buildMode].serviceUrl,
};

export default defineConfig({
  base: buildConfig.BASE_PATH,
  plugins: [
    vue(
      { template: { compilerOptions: { whitespace: 'preserve' } } }
    ),
  ],
  server: {
    port: 8080
  },
  define: {},
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@modules-scss',
        replacement: isSymlink('@piveau/piveau-hub-ui-modules') ?
          path.resolve(__dirname, '..', '..', 'node_modules', '@piveau/piveau-hub-ui-modules', 'dist', 'scss')
          : path.resolve(__dirname, 'node_modules', '@piveau/piveau-hub-ui-modules', 'dist', 'scss')
      },
      {
        find: /^~(.*)$/,
        replacement: '$1',
      },
      {
        find: 'lodash',
        replacement: 'lodash-es',
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    preserveSymlinks: false
  },

  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'app.[hash].js',
      }
    }
  }
});
```
</details>


## 6. Remove outdated content from piveau-hub-ui

<details><summary>Open</summary>
<br>

### 6.1 Remove

- `package-lock.json`
- `/node_modules`

### 6.2 Remove all files / packages regarding:

- `babel`
- `webpack`
</details>