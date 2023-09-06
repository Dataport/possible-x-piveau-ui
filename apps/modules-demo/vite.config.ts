import vue from '@vitejs/plugin-vue';
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
  define: {
    // Shim process.env from webpack
    'process.env': {},
    'process.env.buildconf': JSON.stringify(buildConfig)
  },
  server: {
    port: 8080
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@modules-scss',
        replacement: path.resolve(
          __dirname,
          '..',
          '..',
          'node_modules',
          '@piveau/piveau-hub-ui-modules',
          isSymlink('@piveau/piveau-hub-ui-modules') ? 'lib' : 'dist',
          'scss'
        )
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
  }
});
