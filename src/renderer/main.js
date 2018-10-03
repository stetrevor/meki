import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import VueRx from 'vue-rx'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

import './theme.scss'

Vue.use(VueRx)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')
