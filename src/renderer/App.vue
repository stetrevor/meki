<template>
  <div id="app">
    <transition name="fade-out-in" 
                mode="out-in">
      <keep-alive include="HomePage">
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'

import path from 'path'

import Vue from 'vue'
import { mapActions } from 'vuex'

export default {
  name: 'Paw',

  created() {
    const baseDir =
      process.env.NODE_ENV === 'production'
        ? path.join(remote.app.getPath('userData'), 'images')
        : path.resolve(__dirname, '../../temp', 'images')

    ipcRenderer.send('server-address-request')
    ipcRenderer.on('server-address-response', (_, { address, port }) => {
      Vue.prototype.$serverAddress = `http://${address}:${port}/`

      // Set thumbnail directory
      Vue.prototype.$thumbnailDir = baseDir + '/'

      this.$router.push({ name: 'home' })
    })

    ipcRenderer.send('settings-video-player-request')
    ipcRenderer.on('settings-video-player-response', (_, { muted, volume }) => {
      this.setSoundMuted(muted)
      this.setSoundVolume(volume)
    })

    this.prevent = e => e.preventDefault()

    window.addEventListener('dragover', this.prevent)
    window.addEventListener('drop', this.prevent)
  },

  beforeDestroy() {
    window.removeEventListener('dragover', this.prevent)
    window.removeEventListener('drop', this.prevent)
  },

  methods: mapActions(['setSoundMuted', 'setSoundVolume']),
}
</script>

<style lang="scss">
/* CSS */
</style>
