import { storiesOf } from '@storybook/vue'

const player = storiesOf('Player Page | Player', module)

player.add('Video Player', () => ({ template: '<player-page/>' }))
