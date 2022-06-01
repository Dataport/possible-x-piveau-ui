const path = require('path')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  // https://github.com/vuejs/core/issues/4344#issuecomment-912627569
  chainWebpack(config) {
    config.resolve.symlinks(false)
    config.resolve.alias.set( 'vue', path.resolve('./node_modules/vue'))    
  },  
})
