const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: false,

    // https://github.com/vuejs/core/issues/4344#issuecomment-912627569
    chainWebpack(config) {
      config.resolve.symlinks(false)
      config.resolve.alias.set( 'vue', path.resolve('./node_modules/vue'))
    },
})
