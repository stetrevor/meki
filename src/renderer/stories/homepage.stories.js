import { storiesOf } from '@storybook/vue'

const homepage = storiesOf('Home Page', module)

homepage.add('Add Media Button', () => ({ template: '<add-media-button/>' }))

homepage.add('Icons', () => {
  require('../assets/icons/icon-settings.svg')
  require('../assets/icons/icon-search.svg')
  require('../assets/icons/icon-selection-mode.svg')
  require('../assets/icons/icon-fullscreen.svg')
  require('../assets/icons/icon-fullscreen-exit.svg')

  return {
    template: `
      <div class="theme-text-color-on-primary theme-bg-color-primary"
        style="height: calc(100vh - 24px * 2); padding: 24px 0; display: grid; grid-gap: 24px; grid-template-columns: repeat(auto-fill, 48px); grid-auto-rows: 48px; justify-content: center">
        <svg width="48" height="48"><use xlink:href="#icon-settings"/></svg>
        <svg width="48" height="48"><use xlink:href="#icon-search"/></svg>
        <svg width="48" height="48"><use xlink:href="#icon-selection-mode"/></svg>
        <svg width="48" height="48"><use xlink:href="#icon-fullscreen"/></svg>
        <svg width="48" height="48"><use xlink:href="#icon-fullscreen-exit"/></svg>
      </div>`,
  }
})
