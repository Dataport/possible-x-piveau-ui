import vue from '@vitejs/plugin-vue';
import { lstatSync } from 'node:fs';
import path from 'path';
import { defineConfig } from 'vite';
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
