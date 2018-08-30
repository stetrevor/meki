import { storiesOf } from '@storybook/vue'
import centered from '@storybook/addon-centered'

const homepage = storiesOf('Home Page', module)

homepage.add('Add Media Button', () => ({ template: '<add-media-button/>' }))
