import { storiesOf } from '@storybook/vue'

const homepage = storiesOf('Home Page', module)

homepage.add('Add Media Button', () => ({ template: '<add-media-button/>' }))
