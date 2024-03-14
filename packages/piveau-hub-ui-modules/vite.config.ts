import { defineConfig, PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import copy from 'rollup-plugin-copy';
import dts from 'vite-plugin-dts';
import path from 'path';
import { lstatSync } from 'fs';
import Components from 'unplugin-vue-components/vite'

const peerDependencies = {
  "@formkit/vue": "x.x.x",
  "@citation-js/core": "x.x.x",
  "@citation-js/plugin-bibtex": "x.x.x",
  "@citation-js/plugin-csl": "x.x.x",
  "@citation-js/plugin-doi": "x.x.x",
  "@ecl/preset-ec": "x.x.x",
  "@fortawesome/fontawesome-svg-core": "x.x.x",
  "@fortawesome/free-brands-svg-icons": "x.x.x",
  "@fortawesome/free-regular-svg-icons": "x.x.x",
  "@fortawesome/free-solid-svg-icons": "x.x.x",
  "@fortawesome/vue-fontawesome": "x.x.x",
  "@piveau/piveau-universal-piwik": "x.x.x",
  "@rdfjs/dataset": "x.x.x",
  "@triply/yasgui": "x.x.x",
  "@triply/yasqe": "x.x.x",
  "@triply/yasr": "x.x.x",
  "animejs": "x.x.x",
  "axios": "x.x.x",
  "bootstrap": "x.x.x",
  "ci": "x.x.x",
  "dayjs": "x.x.x",
  "dompurify": "x.x.x",
  "es6-promise": "x.x.x",
  "file-loader": "x.x.x",
  "file-saver": "x.x.x",
  "i18n-iso-countries": "x.x.x",
  "jquery": "x.x.x",
  "jsonld": "x.x.x",
  "jszip": "x.x.x",
  "jwt-decode": "x.x.x",
  "keycloak-js": "x.x.x",
  "leaflet": "x.x.x",
  "leaflet-draw": "x.x.x",
  "leaflet-easybutton": "x.x.x",
  "leaflet-editable": "x.x.x",
  "lodash-es": "x.x.x",
  "marked": "x.x.x",
  "merge-anything": "x.x.x",
  "moment": "x.x.x",
  "n3": "x.x.x",
  "popper.js": "x.x.x",
  "qs": "x.x.x",
  "vee-validate": "x.x.x",
  "vue": "x.x.x",
  "vue3-cookies": "x.x.x",
  "vue-head": "x.x.x",
  "vue-i18n": "x.x.x",
  "vue-matomo": "x.x.x",
  "vue-meta": "x.x.x",
  "vue-position-sticky": "x.x.x",
  "@aacassandra/vue3-progressbar": "x.x.x",
  "vue-router": "x.x.x",
  "vue-select-3": "x.x.x",
  "vue-skeletor": "x.x.x",
  "vue3-click-away": "x.x.x",
  "vue-step-progress": "x.x.x",
  "vue3-datepicker": "x.x.x",
  "vuex": "x.x.x",
  "@unhead/vue": "x.x.x",
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
