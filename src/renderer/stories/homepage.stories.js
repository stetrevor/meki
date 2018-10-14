import { storiesOf } from '@storybook/vue'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import Vue from 'vue'

import FolderItem from '../components/HomePage/FolderItem'

Vue.component('FolderItem', FolderItem)

const amb = storiesOf('Home Page | Add Media Button', module)

amb.add('Add Media Button', () => ({ template: '<add-media-button/>' }))

const nav = storiesOf('Home Page | Navigation', module)

nav.add('NavItem', () => ({
  template: `
    <div class="theme-bg-color-primary" style="width: 100vw; height: 100vh; padding: 48px 0; display: flex; flex-direction: column">
      <nav-item>Recents</nav-item>
      <nav-item class="nav-item--active">Movies</nav-item>
    </div>`,
}))

nav.add('NavBar', () => ({
  template: `
    <div class="theme-bg-color-primary" style="width: 100vw; height: 100vh; padding: 48px 0">
      <nav-bar :nav-items="['recents', 'favorites', 'movies', 'tv shows', 'videos', 'private']"/>
    </div>`,
}))

const back = storiesOf('Home Page | Backdrop', module)

back.add('Back Layer', () => ({
  template: '<home-page/>',
}))

const video = storiesOf('Home Page | Video', module)

video.add('VideoItem', () => ({
  data() {
    return {
      selectionMode: false,
    }
  },

  template: `
  <div>
    <button @click="selectionMode = !selectionMode">Toggle Selection Mode</button>
    <div>Selection Mode {{ selectionMode }}</div>
    <video-item :selection-mode="selectionMode"/>
  </div>
  `,
}))

video.add('VideoItem List', () => ({
  data() {
    return {
      selectionMode: false,
    }
  },

  template: `
  <div>
    <button @click="selectionMode = !selectionMode">Toggle Selection Mode</button>
    <div>Selection Mode {{ selectionMode }}</div>
    <div style="padding: 24px 0; display: grid; grid-gap: 24px; grid-template-columns: repeat(auto-fill, 300px); justify-content: center"
        class="theme-bg-color-primary-lighter">
      <video-item :selection-mode="selectionMode" v-for="i in 20" :key="i"/>
    </div>
  </div>
  `,
}))

const folder = storiesOf('Home Page | Folder Item', module)

folder.addDecorator(withKnobs)

folder.add('FolderItem', () => {
  const selectionMode = boolean('Selection Mode', false)
  const selected = boolean('Selected', false)

  return {
    template: `
    <folder-item :selection-mode="${selectionMode}"
                :selected="${selected}"
                :folder="{ title: 'A Very Long Folder Name That Will Cause Text Ellipsis To Show Up' }"/>
    `,
  }
})

const menu = storiesOf('Home Page | Selection Menu', module)

menu.add('SelectionMenu', () => {
  require('../assets/icons/icon-more.svg')

  return {
    template: `
    <div class="theme-bg-color-primary-lighter" style="width: 100vw; height: 100vh; padding: 48px 0; display: flex; align-items: center; justify-content: center">
      <icon-button icon="more" @clicked.stop="show = true"/>
      <selection-menu style="position: absolute" v-if="show" @select-all="show = false" @select-none="show = false" @dismiss="show = false"/>
    </div>`,

    data() {
      return {
        show: false,
      }
    },
  }
})
