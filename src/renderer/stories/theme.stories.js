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
      'primary background': 'Text Primary on Background',
      'primary-lighter background': 'Text Primary Lighter on Background',
      'secondary background': 'Text Secondary on Background',
      'primary secondary': 'Text Primary on Secondary',
      'primary-lighter secondary': 'Text Primary Lighter on Secondary',
      'on-secondary secondary': 'Text on Secondary',
      'secondary primary': 'Text Secondary on Primary',
      'on-primary primary': 'Text on Primary',
      'secondary primary-lighter': 'Text Secondary on Primary Lighter',
      'on-primary-lighter primary-lighter': 'Text on Primary Lighter',
    },
    'primary background',
  )

  return { template: `<app-typography colors="${colors}"/>` }
})
