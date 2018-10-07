import { storiesOf } from '@storybook/vue'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import Vue from 'vue'

import IconButton from '../components/Base/IconButton'

Vue.component('IconButton', IconButton)

const base = storiesOf('Base Components', module)

const iconButton = storiesOf('Base Components | IconButton', module)

iconButton.addDecorator(withKnobs)

iconButton.add('Icon', () => {
  require('../assets/icons/icon-settings.svg')
  require('../assets/icons/icon-search.svg')
  require('../assets/icons/icon-selection-mode.svg')
  require('../assets/icons/icon-fullscreen.svg')
  require('../assets/icons/icon-fullscreen-exit.svg')

  return {
    template: `
      <div class="theme-text-color-on-primary theme-bg-color-primary"
           style="width: calc(100vw - 24 * 2); height: calc(100vh - 24px * 2); padding: 24px; display: grid; grid-gap: 24px; grid-template-columns: repeat(auto-fill, 48px); grid-auto-rows: 48px; justify-content: center">
        <svg width="48" height="48"><use xlink:href="#icon-settings"/></svg>
        <svg width="48" height="48"><use xlink:href="#icon-search"/></svg>
        <svg width="48" height="48"><use xlink:href="#icon-selection-mode"/></svg>
        <svg width="48" height="48"><use xlink:href="#icon-fullscreen"/></svg>
        <svg width="48" height="48"><use xlink:href="#icon-fullscreen-exit"/></svg>
      </div>`,
  }
})

iconButton.add('Icon Button', () => {
  require('../assets/icons/icon-settings.svg')
  require('../assets/icons/icon-search.svg')
  require('../assets/icons/icon-selection-mode.svg')
  require('../assets/icons/icon-fullscreen.svg')
  require('../assets/icons/icon-fullscreen-exit.svg')

  const disabled = boolean('Disabled', false)

  return {
    template: `
    <div class=""
         style="width: calc(100vw - 24 * 2); height: calc(100vh - 24px * 2); padding: 24px; display: grid; grid-gap: 24px; grid-template-columns: repeat(auto-fill, 96px); grid-auto-rows: 96px">
      <div class="theme-bg-color-primary" style="width: 100%; height: 100%; display: flex; ; align-items: center; justify-content: center">
        <icon-button :disabled="${disabled}" theme="on-primary" icon="settings"/>
      </div>
      <div class="theme-bg-color-primary-lighter" style="width: 100%; height: 100%; display: flex; ; align-items: center; justify-content: center; border: 1px solid">
        <icon-button :disabled="${disabled}" theme="on-primary-lighter" icon="settings"/>
      </div>
      <div class="theme-bg-color-secondary" style="width: 100%; height: 100%; display: flex; ; align-items: center; justify-content: center; border: 1px solid">
        <icon-button :disabled="${disabled}" theme="on-secondary" icon="settings"/>
      </div>
      <div class="theme-bg-color-background" style="width: 100%; height: 100%; display: flex; ; align-items: center; justify-content: center; border: 1px solid">
        <icon-button :disabled="${disabled}" theme="on-background" icon="settings"/>
      </div>
      <div class="" style="width: 100%; height: 100%; display: flex; ; align-items: center; justify-content: center; border: 1px solid">
        <icon-button :disabled="${disabled}" theme="primary" icon="settings"/>
      </div>
      <div class="" style="width: 100%; height: 100%; display: flex; ; align-items: center; justify-content: center; border: 1px solid">
        <icon-button :disabled="${disabled}" theme="primary-lighter" icon="settings"/>
      </div>
      <div class="" style="width: 100%; height: 100%; display: flex; ; align-items: center; justify-content: center; border: 1px solid">
        <icon-button :disabled="${disabled}" theme="secondary" icon="settings"/>
      </div>
    </div>`,
  }
})

iconButton.add('Icon Button | Toggle', () => {
  require('../assets/icons/icon-settings.svg')
  require('../assets/icons/icon-search.svg')
  require('../assets/icons/icon-selection-mode.svg')
  require('../assets/icons/icon-fullscreen.svg')
  require('../assets/icons/icon-fullscreen-exit.svg')

  return {
    template: `
    <div class="theme-bg-color-primary"
         style="width: calc(100vw - 24 * 2); height: calc(100vh - 24px * 2); padding: 24px; display: grid; grid-gap: 24px; grid-template-columns: repeat(auto-fill, 48px); grid-auto-rows: 48px; justify-content: center">
         <icon-button :toggled="toggled" @clicked="toggled = !toggled" icon="fullscreen" icon-toggled="fullscreen-exit"/>
         <icon-button :toggled="toggled" @clicked="toggled = !toggled" icon="search" icon-toggled="settings"/>
         <icon-button :toggled="toggled" @clicked="toggled = !toggled" icon="selection-mode" icon-toggled="fullscreen-exit"/>
         <icon-button :toggled="toggled" @clicked="toggled = !toggled" icon="settings" icon-toggled="fullscreen-exit"/>
         <icon-button icon="settings" icon-toggled="fullscreen-exit" :disabled="true"/>
    </div>`,

    data() {
      return { toggled: false }
    },
  }
})

iconButton.add('Overlay Icon Button', () => {
  require('../assets/icons/icon-play.svg')
  require('../assets/icons/icon-selection-mode.svg')

  return {
    template: `
    <div style="background-image: url('https://placekitten.com/3000/2000'); height: calc(100vh - 24px * 2); padding: 24px; display: grid; grid-gap: 24px; grid-template-columns: repeat(auto-fit, min(96px)); justify-items: center; align-items: center; grid-auto-rows: 96px">
      <overlay-icon-button icon="play" style="width: 48px; height: 48px"/>
      <overlay-icon-button icon="play" style="width: 96px; height: 96px"/>
      <overlay-icon-button icon="selection-mode" style="width: 48px; height: 48px"/>
    </div>`,
  }
})

base.add('Progress Bar', () => ({
  template: `
  <div class="theme-bg-color-primary" style="padding: 48px; width: calc(100vw - 48px * 2); height: calc(100vh - 48px * 2); display: grid; grid-gap: 24px">
    <progress-bar :progress="32" :max="100"/>
    <progress-bar :colored="true" :progress="64" :max="100"/>
    <progress-bar :colored="true" :progress="64" :max="100" class="theme-bg-color-background"/>
    <progress-bar :colored="true" :progress="64" :max="100" class="theme-bg-color-background" style="border-radius: 2px"/>
  </div>
  `,
}))
