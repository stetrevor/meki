import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import SplashScreen from '@/components/SplashScreen'
import HomePage from '@/components/HomePage'
import MediaItemDetails from '@/components/MediaItemDetails'
import VideoPlayer from '@/components/VideoPlayer'

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
      path: '/details',
      name: 'details',
      component: MediaItemDetails,
    },
    {
      path: 'player',
      name: 'player',
      component: VideoPlayer,
    },
    {
      path: '*',
      redirect: '/home',
    },
  ],
})
