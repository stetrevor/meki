import { storiesOf } from '@storybook/vue'

const base = storiesOf('Base Components', module)

base.add('Icon', () => {
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

base.add('Icon Button', () => {
  require('../assets/icons/icon-settings.svg')
  require('../assets/icons/icon-search.svg')
  require('../assets/icons/icon-selection-mode.svg')
  require('../assets/icons/icon-fullscreen.svg')
  require('../assets/icons/icon-fullscreen-exit.svg')

  return {
    template: `
    <div class="theme-bg-color-primary"
         style="height: calc(100vh - 24px * 2); padding: 24px 0; display: grid; grid-gap: 24px; grid-template-columns: repeat(auto-fill, 48px); grid-auto-rows: 48px; justify-content: center">
      <icon-button icon="settings"/>
      <icon-button icon="search"/>
      <icon-button icon="selection-mode"/>
      <icon-button icon="fullscreen"/>
      <icon-button icon="fullscreen-exit"/>
    </div>`,
  }
})

base.add('Icon Toggle Button', () => {
  require('../assets/icons/icon-settings.svg')
  require('../assets/icons/icon-search.svg')
  require('../assets/icons/icon-selection-mode.svg')
  require('../assets/icons/icon-fullscreen.svg')
  require('../assets/icons/icon-fullscreen-exit.svg')

  return {
    template: `
    <div class="theme-bg-color-primary"
         style="height: calc(100vh - 24px * 2); padding: 24px 0; display: grid; grid-gap: 24px; grid-template-columns: repeat(auto-fill, 48px); grid-auto-rows: 48px; justify-content: center">
         <icon-toggle-button icon-normal="fullscreen" icon-toggled="fullscreen-exit"/>
         <icon-toggle-button icon-normal="search" icon-toggled="settings"/>
         <icon-toggle-button icon-normal="selection-mode" icon-toggled="fullscreen-exit"/>
         <icon-toggle-button icon-normal="settings" icon-toggled="fullscreen-exit"/>
    </div>`,
  }
})

base.add('Overlay Icon Button', () => {
  require('../assets/icons/icon-play.svg')
  require('../assets/icons/icon-selection-mode.svg')

  return {
    template: `
    <div style="background-image: url('https://placekitten.com/3000/2000'); height: calc(100vh - 24px * 2); padding: 24px; display: grid; grid-gap: 24px; grid-template-columns: repeat(auto-fit, 96px); justify-items: center; align-items: center; grid-auto-rows: 96px">
      <overlay-icon-button icon="play" style="width: 48px; height: 48px"/>
      <overlay-icon-button icon="play" style="width: 96px; height: 96px"/>
      <overlay-icon-button icon="selection-mode" style="width: 48px; height: 48px"/>
    </div>`,
  }
})

base.add('Progress Bar', () => ({
  template: `
  <div class="theme-bg-color-primary" style="padding: 48px; width: calc(100vw - 48px * 2); height: calc(100vh - 48px * 2); display: grid; grid-gap: 24px; just">
    <progress-bar :progress="32" :max="100"/>
    <progress-bar :colored="true" :progress="64" :max="100"/>
    <progress-bar :colored="true" :progress="64" :max="100" class="theme-bg-color-background"/>
    <progress-bar :colored="true" :progress="64" :max="100" class="theme-bg-color-background" style="border-radius: 2px"/>
  </div>
  `,
}))
