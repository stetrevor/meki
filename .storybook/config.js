import { configure } from '@storybook/vue'
import { setOptions } from '@storybook/addon-options'
import Vue from 'vue'
import Vuex from 'vuex'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import path from 'path'

import VueMDCAdapter from 'vue-mdc-adapter'
import '../src/renderer/theme.scss'

Vue.use(Vuex)
Vue.use(VueMDCAdapter)

const requireComponent = require.context(
  '../src/renderer/components',
  true,
  /\.vue$/,
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(camelCase(path.basename(fileName, '.vue')))
  Vue.component(componentName, componentConfig.default || componentConfig)
})

setOptions({
  hierarchyRootSeparator: /\|/,
})

function loadStories() {
  require('../src/renderer/stories')

  const req = require.context('../src/renderer/stories', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
