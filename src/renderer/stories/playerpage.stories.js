import { storiesOf } from '@storybook/vue'

const slider = storiesOf('Player Page | Slider', module)

slider.add('PlayerSlider', () => ({
  template: `
  <div class="theme-bg-color-primary theme-text-color-on-primary"
       style="box-sizing: border-box; padding: 64px; width: 100vw; height: 100vh; display: flex; align-items: center; flex-direction: column">
    {{ value1 + ' / 100' }}
    <player-slider :initial-value="32" :max="100" @value-changed="valueChanged1"/>
    {{ value2 + ' / 100' }}
    <player-slider :initial-value="64" :max="100" :discrete="false" @value-changed="valueChanged2"/>
  </div>`,

  data() {
    return {
      value1: 0,
      value2: 0,
    }
  },

  methods: {
    valueChanged1(value) {
      this.value1 = value
    },

    valueChanged2(value) {
      this.value2 = value
    },
  },
}))

const player = storiesOf('Player Page | Player', module)

player.add('Video Player', () => ({ template: '<player-page/>' }))
