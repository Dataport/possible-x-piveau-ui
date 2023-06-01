// import vue from '@vitejs/plugin-vue'
import vue from '@vitejs/plugin-vue2';
import { resolve } from 'path'
import {defineConfig, PluginOption} from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  plugins: [
    vue(),
    // dts()
    // dts({ rollupTypes: true })
    copy({
      targets: [
        { src: 'lib/scss', dest: 'dist' }
      ],
      hook: 'writeBundle',
      verbose: true,
    }) as PluginOption,
  ],
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
        // Use lodash-es instead of lodash
        find: 'lodash',
        replacement: 'lodash-es',
      }
      ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    preserveSymlinks: false,
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'piveau-hub-ui-modules',
      fileName: 'piveau-hub-ui-modules',
      // the proper extensions will be added
      // formats: ['es', 'cjs'],
      // fileName: format => `package1.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'vuex', 'jquery', 'lodash-es', 'skeleton-loader-vue', 'leaflet',
        'leaflet/dist/images/marker-icon-2x.png', 'leaflet/dist/images/marker-icon.png',
        'leaflet/dist/images/marker-shadow.png', '@triply/yasgui', 'vue-step-progress/dist/vue-step-progress.min.js',
        'vue-step-progress/dist/main.css', 'merge-anything', 'vue2-datepicker', 'vue2-datepicker/index.css',
          'keycloak-js', 'leaflet-draw', 'leaflet-easybutton', 'leaflet-editable', '@citation-js/core',
          '@citation-js/plugin-csl', '@citation-js/plugin-doi', 'i18n-iso-countries', 'marked', 'dompurify',
          'vue-inject', 'file-saver', 'jszip', 'vue-clickaway', 'n3', '@rdfjs/dataset', 'leaflet/dist/leaflet.css'
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
        // preserveModules: true, // important to support tree-shaking
        // exports: "named"
      },
    },
  },
})
