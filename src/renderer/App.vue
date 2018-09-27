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
import { ipcRenderer } from 'electron'

import Vue from 'vue'
import { mapActions } from 'vuex'

export default {
  name: 'Paw',

  created() {
    ipcRenderer.send('server-address-request')
    ipcRenderer.on('server-address-response', (_, { address, port }) => {
      Vue.prototype.$serverAddress = `http://${address}:${port}/`
      this.$router.push({ name: 'home' })
    })

    ipcRenderer.send('settings-video-player-request')
    ipcRenderer.on('settings-video-player-response', (_, { muted, volume }) => {
      this.setSoundMuted(muted)
      this.setSoundVolume(volume)
    })
  },

  methods: mapActions(['setSoundMuted', 'setSoundVolume']),
}
</script>

<style lang="scss">
/* CSS */
</style>
