import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import SplashScreen from '@/components/SplashScreen'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'splash-screen',
      component: SplashScreen,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
