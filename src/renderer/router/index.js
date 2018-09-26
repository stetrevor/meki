import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import SplashScreen from '@/components/SplashScreen'
import HomePage from '@/components/HomePage'
import PlayerPage from '@/components/PlayerPage'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'splash-screen',
      component: SplashScreen,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
    {
      path: 'player',
      name: 'player',
      component: PlayerPage,
    },
    {
      path: '*',
      redirect: '/home',
    },
  ],
})
