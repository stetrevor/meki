import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import VueRx from 'vue-rx'
import VueHotkey from 'v-hotkey'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

import './theme.scss'

Vue.use(VueRx)
Vue.use(VueHotkey)

Vue.directive('visible', (el, binding) => {
  const visibility = !!binding.value ? 'visible' : 'hidden'

  el.style.visibility = visibility
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')
