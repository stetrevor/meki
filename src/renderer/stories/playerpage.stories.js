import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

import BaseSlider from '../components/Base/BaseSlider'

Vue.component('BaseSlider', BaseSlider)

const slider = storiesOf('Player Page | Slider', module)

slider.add('VideoPlayer', () => ({
  template: `
  <div class="theme-bg-color-primary theme-text-color-on-primary"
       style="box-sizing: border-box; padding: 64px; width: 100vw; height: 100vh; display: flex; align-items: center; flex-direction: column">
    {{ value1 + ' / 100' }}
    <base-slider :value="32" :max="100" :discrete="true" @value-changed="valueChanged1"/>
    {{ value2 + ' / 100' }}
    <base-slider :value="64" :max="100" @value-changed="value2 = arguments[0]"/>
    {{ value3 + ' / ' + \`${120 * 60 * 60 * 1000}\` }}
    <base-slider :value="5 * 60 * 60 * 1000" :max="120 * 60 * 60 * 1000" :discrete="true" @value-changed="value3 = $event"/>
  </div>`,

  data() {
    return {
      value1: 0,
      value2: 0,
      value3: 0,
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

const subtitles = storiesOf('Player Page | Subtitles', module)

subtitles.add('Subtitle Menu', () => ({
  template: `
    <div class="theme-bg-color-primary-lighter" style="width: 100vw; height: 100vh; padding: 48px 0; display: flex; flex-direction: column; align-items: center; justify-content: center">
      <subtitle-menu style="margin-bottom: 8px"
                     v-show="show"
                     :subtitles="subtitles"
                     @active-subtitle-changed="setActiveSubtitle"
                     @dismiss="show = false"/>
      <icon-button icon="subtitle" @clicked.stop="show = !show" :active="show"/>
    </div>`,

  data() {
    return {
      subtitles: [
        { _id: '1', default: false, title: 'English', lang: 'en' },
        { _id: '2', default: true, title: 'English 2', lang: 'en' },
        { _id: '3', default: false, title: 'Chinese', lang: 'cn' },
      ],
      show: false,
    }
  },

  methods: {
    setActiveSubtitle(subtitle) {
      const oldIndex = this.subtitles.findIndex(s => s.default)
      const old = this.subtitles[oldIndex]
      this.subtitles.splice(
        oldIndex,
        1,
        Object.assign({}, old, { default: false }),
      )

      const index = this.subtitles.findIndex(s => s._id === subtitle._id)
      this.subtitles.splice(
        index,
        1,
        Object.assign({}, subtitle, { default: true }),
      )

      console.log(
        Object.assign({}, old, { default: false }),
        Object.assign({}, subtitle, { default: true }),
      )
    },
  },
}))

const hover = storiesOf('Player Page | Hover Behavior', module)

hover.add('Hover To Show Controls', () => ({
  template: `
  <hover-control style="width: 100vw; height: 100vh"/>
  `,
}))
