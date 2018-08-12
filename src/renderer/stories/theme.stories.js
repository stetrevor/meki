import { storiesOf } from '@storybook/vue'
import { withKnobs, select } from '@storybook/addon-knobs'
import Vue from 'vue'

import AppTheme from './AppTheme'
import AppTypography from './AppTypography'

Vue.component('AppTheme', AppTheme)
Vue.component('AppTypography', AppTypography)

const theme = storiesOf('App Theme', module)

theme.add('Colors', () => ({ template: '<app-theme />' }))

theme.addDecorator(withKnobs)
theme.add('Typography', () => {
  const colors = select(
    'Background Color',
    {
      'primary-bg primary': 'Primary',
      'secondary-bg secondary': 'Secondary',
      'surface surface': 'Surface',
      'background background': 'Background',
    },
    'background background',
  )

  return { template: `<app-typography colors="${colors}"/>` }
})
