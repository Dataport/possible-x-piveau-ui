const webpack = require('webpack');
const { defineConfig } = require('@vue/cli-service');
const config = require('./config');
const package = require('./package.json');
const path = require('path');
const copy = require('copy-webpack-plugin');

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

module.exports = defineConfig({
  transpileDependencies: true,
  css: { extract: false },
  publicPath: buildConfig.BASE_PATH,
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.buildconf': JSON.stringify(buildConfig)
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/i,
          parser: {
            dataUrlCondition: {
              maxSize: 32 * 1024, // This ensures also larger images will be inlined in our module bundle
            },
          }
        },
      ]
    }
  },

  chainWebpack: (config) => {
    // Preserve whitespaces between element tags if it contains new lines.
    // This fixes minor visual layout differences.
    // See https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#options
    config
        .module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
            if (options && options.compilerOptions) {
              options.compilerOptions.whitespace = 'preserve';
              return options;
            }
          }
        );
  }
});
