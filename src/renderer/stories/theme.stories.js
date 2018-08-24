import { storiesOf } from '@storybook/vue'
import { withKnobs, select } from '@storybook/addon-knobs'
import Vue from 'vue'

import AppColor from './AppColor'
import AppTypography from './AppTypography'

Vue.component('AppColor', AppColor)
Vue.component('AppTypography', AppTypography)

const theme = storiesOf('App Theme', module)

theme.add('Colors', () => ({ template: '<app-color />' }))

theme.addDecorator(withKnobs)
theme.add('Typography', () => {
  const colors = select(
    'Colors',
    {
      'primary background': 'Primary on Background',
      'primary-lighter background': 'Primary Lighter on Background',
      'secondary background': 'Secondary on Background',
      'primary secondary': 'Primary on Secondary',
      'primary-lighter secondary': 'Primary Lighter on Secondary',
      'background secondary': 'Background on Secondary',
      'secondary primary': 'Secondary on Primary',
      'background primary': 'Background on Primary',
      'secondary primary-lighter': 'Secondary on Primary Lighter',
      'background primary-lighter': 'Background on Primary Lighter',
    },
    'primary background',
  )

  return { template: `<app-typography colors="${colors}"/>` }
})
