import { storiesOf } from '@storybook/vue'
import centered from '@storybook/addon-centered'

const homePage = storiesOf('Paw', module)

homePage.addDecorator(centered)

homePage.add('App Name', () => ({ template: '<h1>Paw: Media Manager</h1>' }))
homePage.add('App Logo', () => {
  require('../assets/logo.svg')

  return {
    template:
      '<svg width="256" height="256" class="theme-text-color-secondary"><use xlink:href="#logo"></use></svg>',
  }
})
