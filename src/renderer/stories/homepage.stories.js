import { storiesOf } from '@storybook/vue'

const amb = storiesOf('Home Page | Add Media Button', module)

amb.add('Add Media Button', () => ({ template: '<add-media-button/>' }))
