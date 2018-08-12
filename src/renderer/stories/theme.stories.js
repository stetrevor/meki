import { storiesOf } from '@storybook/vue'
import backgrounds from '@storybook/addon-knobs'
import Vue from 'vue'

import AppTheme from './AppTheme'

Vue.component('AppTheme', AppTheme)

const theme = storiesOf('App Theme', module)

theme.add('Colors', () => ({ template: '<app-theme />' }))
