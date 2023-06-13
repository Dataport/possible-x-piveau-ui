import vue from '@vitejs/plugin-vue2';
import { lstatSync } from 'node:fs';
import path from 'path';
import { defineConfig } from 'vite';
import config from './config';
import pkg from './package.json';

const isSymlink = (pkg) => {
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

const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
];

// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
const regexesOfPackages = externalPackages
  .map(packageName => new RegExp(`^${packageName}(/.*)?`));

export default defineConfig({
  plugins: [
    vue(
      { template: { compilerOptions: { whitespace: 'preserve' } } }
    ),
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
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@modules-scss',
        replacement: isSymlink('@piveau/piveau-hub-ui-modules') ?
          path.resolve(__dirname, 'node_modules', '..', '..', '@piveau/piveau-hub-ui-modules', 'dist', 'scss')
          : path.resolve(__dirname, 'node_modules', '@piveau/piveau-hub-ui-modules', 'dist', 'scss')
      },
      {
        find: /^~(.*)$/,
        replacement: '$1',
      },
      {
        // Use lodash-es instead of lodash
        find: 'lodash',
        replacement: 'lodash-es',
      },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    preserveSymlinks: false
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false,
    sourcemap: true,

    lib: {
      entry: path.resolve(__dirname, 'src/modules/index.ts'),
      name: 'piveau-hub-ui-modules',
      fileName: 'piveau-hub-ui-modules',
      formats: ['es'],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
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
