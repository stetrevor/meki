import { storiesOf } from '@storybook/vue'
import centered from '@storybook/addon-centered'

const homePage = storiesOf('Paw', module)

homePage.addDecorator(centered)

homePage.add('App Name', () => ({ template: '<h1>Paw: Media Manager</h1>' }))
