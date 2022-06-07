const webpack = require('webpack');
const { defineConfig } = require('@vue/cli-service');
const config = require('./config');
const package = require('./package.json');

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
    plugins: [
      new webpack.DefinePlugin({
        'process.env.buildconf': JSON.stringify(buildConfig)
      }),
    ]
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
              options.compilerOptions.whitespace = 'preserve';
              return options;
            }
        );

    if (process.env.BUILD_MODE === 'lib') {
      const dependencyKeys = Object.keys(package.dependencies);
      const dependenciesObject = dependencyKeys.reduce((acc, curr) => {
        acc[curr] = curr;
        return acc;
      }, {});
      config.externals(dependenciesObject);
    }
  }
});
