import { configure } from '@storybook/vue'
import { setOptions } from '@storybook/addon-options'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRx from 'vue-rx'

import '../src/renderer/theme.scss'

Vue.use(Vuex)
Vue.use(VueRx)

setOptions({
  hierarchyRootSeparator: /\|/,
})

function loadStories() {
  require('../src/renderer/stories')

  const req = require.context('../src/renderer/stories', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
