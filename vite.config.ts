import { defineConfig, PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue2';
import copy from 'rollup-plugin-copy';
import path from 'path';
import { lstatSync } from 'fs';
import config from './config';
import pkg from './package.json';

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
  BASE_PATH: config[buildMode].assetsPublicPath,
  SERVICE_URL: config[buildMode].serviceUrl,
};

const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
  // ...Object.keys(pkg.peerDependencies || {}),
];

// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
const regexesOfPackages = externalPackages
  .map(packageName => new RegExp(`^${packageName}(/.*)?`));

console.log('externalPackages', externalPackages);

export default defineConfig({
  plugins: [
    vue(
      { template: { compilerOptions: { whitespace: 'preserve' } } }
    ),
    copy({
      targets: [
        { src: 'src/modules/dist/scss', dest: 'dist' }
      ],
      hook: 'writeBundle',
      verbose: true,
    }) as PluginOption
  ],
  server: {
    port: 8080
  },
  define: {
    // Shim process.env from webpack
    'process.env': {},
    'process.env.buildconf': JSON.stringify(buildConfig)
  },

  optimizeDeps: {
    include: [
      '@piveau/piveau-hub-ui-modules'
    ],
    exclude: []
  },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
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
      ...!doesDirectoryExist(
        path.resolve(__dirname, 'node_modules/@piveau/piveau-hub-ui-modules')
      )
        ? [
            {
              // Replace @piveau/piveau-hub-ui-modules with relative path
              find: '@piveau/piveau-hub-ui-modules',
              replacement: path.resolve(__dirname, 'src/modules'),
            },
        ]
        : []
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    preserveSymlinks: false,
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    sourcemap: true,

    lib: {
      entry: path.resolve(__dirname, 'src/modules/index.ts'),
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
        preserveModulesRoot: 'src/modules',
      },
    }
  }
});
