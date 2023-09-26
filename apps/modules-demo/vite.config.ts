import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { defineConfig } from 'vite';
import { lstatSync } from 'node:fs';
import config from './config';
import path from 'path';

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

export default defineConfig({
  plugins: [
    vue({ 
      template: { 
        compilerOptions: { 
          whitespace: 'preserve' ,
          compatConfig: {
            MODE: 3,
          },
        },
      },
    }),
    VueI18nPlugin({
      strictMessage: false,
      include: [path.resolve(__dirname, './config/i18n/lang/**')],
    }),
  ],
  define: {
    // Shim process.env from webpack
    'process.env': {},
    'process.env.buildconf': JSON.stringify(buildConfig),
  },
  server: {
    port: 8080,
  },
  resolve: {
    alias: [
      {
        find: 'vue',
        replacement: '@vue/compat',
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
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
    preserveSymlinks: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
});
