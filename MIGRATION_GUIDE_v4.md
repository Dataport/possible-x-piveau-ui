# Migration Guide (v4)

To make use of the latest modules version in your projects piveau-hub-ui, apply the following changes:

## 1. Update `package.json`

### 1.1 Replace vue-cli commands in `package.json` and use Vite:

```js
  "scripts": {
    "dev": "npm run serve",
    "serve": "vite --host",
    "build": "vite build"
  },
```

### 1.2 Upgrade piveau packages to Vue 3 compatible versions in `package.json`:

```js
"@piveau/piveau-hub-ui-modules": "4.x.x",
"@piveau/piveau-universal-piwik": "3.x.x",
```

### 1.3 Upgrade Vue in `package.json`:

_Note: Use the "@vue/compat" package for testing. There may be more dependencies to add / upgrade in your project!_

```js
"vue": "^3.1.0",
"@vue/compat": "^3.1.0",
```

### 1.4 Upgrade other packages to Vue 3 compatible versions in `package.json`:

```js
"vite": "^4.0.3",
"vue-router": "^4.1.6",
"vuex": "^4.0.2",
"vee-validate": "^4.7.4",
```


#### 1.5 Add new Vue 3 compatible packages to `package.json`:

```js
"@vitejs/plugin-vue": "^4.0.0",
"vue-select-3": "^1.0.1",
"vue-skeletor": "^1.0.6",
"vue3-click-away": "^1.2.4",
"vue3-step-progress": "^0.2.6",
"vue3-datepicker": "^0.3.4",
```

### 1.6 Remove incompatible packages from `package.json`:

```js
"@piveau/dcatap-frontend": "x.x.x",
"@vitejs/plugin-vue2": "^2.2.0",
"@vue/cli-plugin-babel": "~5.0.0",
"@vue/cli-plugin-eslint": "~5.0.0",
"@vue/cli-plugin-router": "~5.0.0",
"@vue/cli-plugin-typescript": "~5.0.0",
"@vue/cli-plugin-unit-jest": "~5.0.0",
"@vue/cli-plugin-vuex": "~5.0.0",
"@vue/compiler-sfc": "^3.2.45",
"core-js": "x.x.x",
"skeleton-loader-vue": "^1.0.10",
"vue-clickaway": "^2.2.2",
"vue-select": "^3.18.3",
"vue-step-progress": "^0.3.7",
"vue2-datepicker": "^3.11.0",
```

### 2. Apply changes to components in piveau-hub-ui

<br>

#### In main.ts change:

| Old Value | New Value |
| ------    | ------    |
| |  |

<br>

#### In App.vue change: 

| Old Value | New Value |
| ------    | ------    |
| |  |

<br>

#### In router.js change: 

| Old Value | New Value |
| ------    | ------    |
| |  |

### 5. Remove unused files in piveau-hub-ui

- babel
- webpack