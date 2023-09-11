import { defineConfig, PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import copy from 'rollup-plugin-copy';
import dts from 'vite-plugin-dts';
import path from 'path';
import { lstatSync } from 'fs';
import Components from 'unplugin-vue-components/vite'

const peerDependencies = {
  "@braid/vue-formulate": "^2.5.3",
  "@citation-js/core": "^0.5.7",
  "@citation-js/plugin-bibtex": "^0.5.7",
  "@citation-js/plugin-csl": "^0.5.7",
  "@citation-js/plugin-doi": "^0.5.7",
  "@deu/deu-cookie-consent": "^3.0.3",
  "@deu/deu-header-footer": "^5.0.4",
  "@ecl/preset-ec": "^3.4.0",
  "@fortawesome/fontawesome-svg-core": "^1.2.4",
  "@fortawesome/free-brands-svg-icons": "^5.11.2",
  "@fortawesome/free-regular-svg-icons": "^5.11.2",
  "@fortawesome/free-solid-svg-icons": "^5.3.1",
  "@fortawesome/vue-fontawesome": "^0.1.1",
  "@piveau/piveau-universal-piwik": "^3.0.0",
  "@rdfjs/dataset": "^2.0.1",
  "@triply/yasgui": "^4.2.25",
  "@triply/yasqe": "^4.2.23",
  "@triply/yasr": "^4.2.25",
  "animejs": "^2.2.0",
  "axios": "^0.21.1",
  "bootstrap": "^4.3.1",
  "ci": "^2.2.0",
  "dayjs": "^1.11.6",
  "dompurify": "^2.3.6",
  "es6-promise": "^4.2.4",
  "file-loader": "^6.2.0",
  "file-saver": "^2.0.5",
  "i18n-iso-countries": "^7.4.0",
  "jquery": "^3.6.0",
  "jsonld": "^5.2.0",
  "jszip": "^3.9.1",
  "jwt-decode": "^2.2.0",
  "keycloak-js": "9.0.2",
  "leaflet": "^1.8.0",
  "leaflet-draw": "^1.0.4",
  "leaflet-easybutton": "^2.4.0",
  "leaflet-editable": "^1.2.0",
  "lodash-es": "^4.17.21",
  "marked": "^4.0.15",
  "merge-anything": "^2.4.1",
  "moment": "^2.29.4",
  "n3": "^1.16.3",
  "popper.js": "^1.14.3",
  "qs": "^6.10.3",
  "vee-validate": "^4.7.4",
  "vue": "^3.1.0",
  "@vue/compat": "^3.1.0",
  "vue-cookie": "^1.1.4",
  "vue-head": "^2.1.2",
  "vue-i18n": "^9.0.0",
  "vue-inject": "^2.1.0",
  "vue-matomo": "^3.9.1-2",
  "vue-meta": "^2.3.1",
  "vue-position-sticky": "^0.2.1",
  "vue-progressbar": "^0.7.4",
  "vue-router": "^4.1.6",
  "vue-select-3": "^1.0.1",
  "vue-skeletor": "^1.0.6",
  "vue3-click-away": "^1.2.4",
  "vue-step-progress": "^1.0.2",
  "vue3-datepicker": "^0.3.4",
  "vuex": "^4.0.2"
};

const doesDirectoryExist = (path : string) => {
  try {
    return lstatSync(path).isDirectory();
  } catch (err) {
    return false;
  }
};

let buildMode;
if (process.env.NODE_ENV === 'production') {
  buildMode = process.env.BUILD_MODE === 'test' ? 'test' : 'build';
} else {
  buildMode = 'dev';
}

const buildConfig = {
  BASE_PATH: buildMode === "build" ? "/data/" : "/", //  config[buildMode].assetsPublicPath,
  SERVICE_URL: undefined, // config[buildMode].serviceUrl
};

const externalPackages = [
  ...Object.keys(peerDependencies),
];

// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
const regexesOfPackages = externalPackages
    .map(packageName => new RegExp(`^${packageName}(/.*)?`));
    
export default defineConfig({
  plugins: [
    Components({ /* options */ }),
    vue(
        { template: { compilerOptions: { whitespace: 'preserve' } } }
    ),
    copy({
      targets: [
        { src: 'lib/scss', dest: 'dist' }
      ],
      hook: 'writeBundle',
      verbose: true,
    }) as PluginOption,
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
    })
  ],
  server: {
    port: 8080
  },
  define: {
    // Shim process.env from webpack
    'process.env': {},
    'process.env.buildconf': JSON.stringify(buildConfig)
  },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'lib')
      },
      {
        find: /^~(.*)$/,
        replacement: '$1',
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm.js',
      },
      {
        find: 'lodash',
        replacement: 'lodash-es',
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
      },
      // Use this as fallback if @piveau/piveau-hub-ui-modules is not found in node_modules
      // ...!doesDirectoryExist(
      //     path.resolve(__dirname, 'node_modules/@piveau/piveau-hub-ui-modules')
      // )
      //     ? [
      //       {
      //         // Replace @piveau/piveau-hub-ui-modules with relative path
      //         find: '@piveau/piveau-hub-ui-modules',
      //         replacement: path.resolve(__dirname, 'src/modules'),
      //       },
      //     ]
      //     : []
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    preserveSymlinks: false,
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false,
    sourcemap: true,

    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      entry: {
        'index': path.resolve(__dirname, 'lib/index'),
        // We build config schema as a separate module due to side effects in the main modules
        // for those who want to use consume the config schema in isolation
        'configSchema': path.resolve(__dirname, 'lib/configurations/config-schema/index'),
      },
      name: 'piveau-hub-ui-modules',
      fileName: 'piveau-hub-ui-modules',
      formats: ['es'],
    },

    rollupOptions: {
      external: ['vue', ...regexesOfPackages],

      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        },

        entryFileNames: (chunkInfo) => {
          // if chunkInfo.name starts with node_modules, replace with external
          if (chunkInfo.name.startsWith('node_modules')) {
            return chunkInfo.name.replace('node_modules', 'external');
          }
          return '[name].mjs';
        },

        assetFileNames: 'piveau-hub-ui-modules.[ext]',

        preserveModules: true,
        preserveModulesRoot: 'lib',
      },
    }
  }
});
