import Vue from 'vue'
import App from './App.vue'
// import { install } from 'vue-demi';

// install();
Vue.config.productionTip = false

import './app.scss';
import router from './router'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
