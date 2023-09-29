# Migration Guide (v4)

This Migration Guide shows how to use Vue 3 together with Vite.

To make use of Vue 3 + Vite in your project, apply the following changes to `piveau-hub-ui`:

## 1. Update `package.json`

<details><summary>Open</summary>
<br>

> _Use the "@vue/compat" package for testing. There may be more dependencies to add / upgrade in your project!_

#### 1.1 Replace vue-cli commands in `package.json` and use Vite:

```js
  "scripts": {
    "dev": "npm run serve",
    "serve": "vite --host",
    "build": "vite build",
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

> _Replace all occurences of `Vue.xxx` by `app.xxx`!_

```js
import { createI18n } from 'vue-i18n'
import { createApp } from 'vue'

const app = createApp(App);

...

app.mount('#app');
```

#### 2.2 `router.js`

> _Base option was removed, use history!_

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

> _Move `index.html` into root directory!_


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

Vue.i18n                              ==> this.i18n.global

Vue.prototype.$env                    ==> app.config.globalProperties.$env

Vue.prototype.<globalProperty>        ==> app.config.globalProperties.<globalProperty>
```
</details>


## 4. Update Keycloak

<details><summary>Open</summary>
<br>

#### 4.1 Update `keycloak-js` package

```js
  "keycloak-js": "22.0.3",
```

#### 4.1 Create `src/services/keycloakService.js` to overwrite keycloak service

```js
// @ts-nocheck
/* eslint-disable */
import { createApp } from 'vue'
import Keycloak from 'keycloak-js';
import qs from 'qs';
import axios from 'axios';
import {
  store
} from '@piveau/piveau-hub-ui-modules';

let installed = false;
let rtpToken = null;

export default {
  install(app, params = {}) {
    if (installed) return;
    installed = true;

    const defaultParams = {
      config: window.__BASEURL__ ? `${window.__BASEURL__}/config` : '/config',
      init: { onLoad: 'login-required' },
    };
    const options = Object.assign({}, defaultParams, params);
    if (assertOptions(options).hasError) throw new Error(`Invalid options given: ${assertOptions(options).error}`);

    const watch = createApp({
      data() {
        return {
          ready: false,
          authenticated: false,
          userName: null,
          fullName: null,
          token: null,
          rtpToken: null,
          tokenParsed: null,
          logoutFn: null,
          loginFn: null,
          login: null,
          createLoginUrl: null,
          createLogoutUrl: null,
          createRegisterUrl: null,
          register: null,
          accountManagement: null,
          createAccountUrl: null,
          loadUserProfile: null,
          loadUserInfo: null,
          subject: null,
          idToken: null,
          idTokenParsed: null,
          realmAccess: null,
          resourceAccess: null,
          refreshToken: null,
          refreshTokenParsed: null,
          timeSkew: null,
          responseMode: null,
          responseType: null,
          hasRealmRole: null,
          hasResourceRole: null,
          getRtpToken: null,
        };
      },
    });

    getConfig(options.config)
    .then((config) => {
      init(config, watch, options);
      Object.defineProperty(app.config.globalProperties, '$keycloak', {
        get() {
          return watch;
        },
      });
    })
    .catch((err) => {
      console.error(err);
    });
  },
};

function init(config, watch, options) {
  const ctor = sanitizeConfig(config);
  const keycloak = new Keycloak(ctor);

  // watch.$once('ready', (cb) => {
  //   cb && cb();
  // });

  keycloak.onReady = function (authenticated) {
    updateWatchVariables(authenticated);
    watch.ready = true;
    typeof options.onReady === 'function' && watch.$emit('ready', options.onReady.bind(this, keycloak));
  };

  keycloak.onAuthSuccess = function () {
    // Check token validity every 10 seconds (10 000 ms) and, if necessary, update the token.
    // Refresh token if it's valid for less then 60 seconds
    const updateTokenInterval = setInterval(() => keycloak.updateToken(60)
    .then((hasRefreshed) => {
      if (hasRefreshed) {
        // When the auth token refreshes, 'invalidate' the stored rtpToken
        // to force getting a new rtpToken the next time
        rtpToken = null;
      }
    })
    .catch(() => {
      rtpToken = null;
      keycloak.clearToken();
    }), 10000);

    watch.logoutFn = () => {
      clearInterval(updateTokenInterval);
    };
  };

  keycloak.onAuthRefreshSuccess = function () {
    updateWatchVariables(true);
  };

  keycloak.init(options.init)
  .catch((err) => {
    typeof options.onInitError === 'function' && options.onInitError(err);
  });

  let updateTokenTimeout = null;

  function getRtpToken({ autoRefresh = false, refreshToken = null} = {}) {
    const rtpConfig = options.config.rtp;
    const baseUrl = options.config.url;
    const realm = options.config.realm;
    const token = keycloak.token;
    const endpoint = `${baseUrl}/realms/${realm}/protocol/openid-connect/token`;
    const requestBody = {
      grant_type: rtpConfig.grand_type,
      audience: rtpConfig.audience,
      ...refreshToken ? { refresh_token: refreshToken } : {},
    };

    return new Promise((resolve, reject) => {
      if (rtpToken && !refreshToken) {
        resolve(rtpToken)
        return;
      }

      axios.post(endpoint, qs.stringify(requestBody), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then((response) => {
        rtpToken = response?.data?.access_token;
        const refreshInterval = response?.data?.expires_in * 1000 * 0.8;

        if (autoRefresh) {
          if (updateTokenTimeout) clearTimeout(updateTokenTimeout);
          updateTokenTimeout = setTimeout(async () => {
            await getRtpToken({ autoRefresh: true, refreshToken: response.data.refresh_token });
          }, refreshInterval);
        }
        updateWatchVariables(true);
        resolve(rtpToken);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  function loginFn(options) {
    keycloak.login(options)
    .then(() => {
      store.dispatch('auth/setKeycloak', keycloak);
      store.dispatch('auth/authLogin', keycloak.authenticated);
    })
    .catch((err) => {
      console.error(`Error keycloak login: ${JSON.stringify(err)}`);
    });
  }

  function logoutFn(options) {
    keycloak.logout(options);
  }

  function updateWatchVariables(isAuthenticated = false) {
    watch.authenticated = isAuthenticated;
    watch.loginFn = loginFn;
    watch.login = keycloak.login;
    watch.createLoginUrl = keycloak.createLoginUrl;
    watch.logoutFn = logoutFn;
    watch.logout = keycloak.logout;
    watch.createLogoutUrl = keycloak.createLogoutUrl;
    watch.createRegisterUrl = keycloak.createRegisterUrl;
    watch.register = keycloak.register;
    if (isAuthenticated) {
      watch.accountManagement = keycloak.accountManagement;
      watch.createAccountUrl = keycloak.createAccountUrl;
      watch.hasRealmRole = keycloak.hasRealmRole;
      watch.hasResourceRole = keycloak.hasResourceRole;
      watch.loadUserProfile = keycloak.loadUserProfile;
      watch.loadUserInfo = keycloak.loadUserInfo;
      watch.token = keycloak.token;
      watch.rtpToken = rtpToken;
      watch.subject = keycloak.subject;
      watch.idToken = keycloak.idToken;
      watch.idTokenParsed = keycloak.idTokenParsed;
      watch.realmAccess = keycloak.realmAccess;
      watch.resourceAccess = keycloak.resourceAccess;
      watch.refreshToken = keycloak.refreshToken;
      watch.refreshTokenParsed = keycloak.refreshTokenParsed;
      watch.timeSkew = keycloak.timeSkew;
      watch.responseMode = keycloak.responseMode;
      watch.responseType = keycloak.responseType;
      watch.tokenParsed = keycloak.tokenParsed;
      watch.userName = keycloak.tokenParsed.preferred_username;
      watch.fullName = keycloak.tokenParsed.name;
      watch.getRtpToken = getRtpToken
    }
  }
}

function assertOptions(options) {
  const {
    config, init, onReady, onInitError,
  } = options;
  if (typeof config !== 'string' && !_isObject(config)) {
    return { hasError: true, error: `'config' option must be a string or an object. Found: '${config}'` };
  }
  if (!_isObject(init) || typeof init.onLoad !== 'string') {
    return { hasError: true, error: `'init' option must be an object with an 'onLoad' property. Found: '${init}'` };
  }
  if (onReady && typeof onReady !== 'function') {
    return { hasError: true, error: `'onReady' option must be a function. Found: '${onReady}'` };
  }
  if (onInitError && typeof onInitError !== 'function') {
    return { hasError: true, error: `'onInitError' option must be a function. Found: '${onInitError}'` };
  }
  return {
    hasError: false,
    error: null,
  };
}

function _isObject(obj) {
  return obj !== null && typeof obj === 'object' && Object.prototype.toString.call(obj) !== '[object Array]';
}

function getConfig(config) {
  if (_isObject(config)) return Promise.resolve(config);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', config);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(Error(xhr.statusText));
        }
      }
    };
    xhr.send();
  });
}

function sanitizeConfig(config) {
  const renameProp = (oldProp, newProp, { [oldProp]: old, ...others }) => ({
    [newProp]: old,
    ...others,
  });
  return Object.keys(config).reduce((previous, key) => {
    if (['authRealm', 'authUrl', 'authClientId'].includes(key)) {
      const cleaned = key.replace('auth', '');
      const newKey = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
      return renameProp(key, newKey, previous);
    }
    return previous;
  }, config);
}
```
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

### 6.1 Delete npm files / packages

- `package-lock.json`
- `/node_modules`

### 6.2 Remove all occurences of:

- `babel`
- `webpack`
</details>

## References

- https://v3-migration.vuejs.org/
- https://vitejs.dev/guide/
- https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/
- https://router.vuejs.org/guide/migration/
- https://vue-i18n.intlify.dev/guide/migration/vue3.html
- https://formkit.com/getting-started/installation
