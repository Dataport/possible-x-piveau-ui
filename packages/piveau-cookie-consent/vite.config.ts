import { defineConfig, PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue2';
import copy from 'rollup-plugin-copy';
import dts from 'vite-plugin-dts';
import path from 'path';
import { lstatSync } from 'fs';
import Components from 'unplugin-vue-components/vite'

const peerDependencies = {
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
        // Use lodash-es instead of lodash
        find: 'lodash',
        replacement: 'lodash-es',
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
      },
      name: 'piveau-cookie-consent',
      fileName: 'piveau-cookie-consent',
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

        assetFileNames: 'piveau-cookie-consent.[ext]',

        preserveModules: true,
        preserveModulesRoot: 'lib',
      },
    }
  }
});
