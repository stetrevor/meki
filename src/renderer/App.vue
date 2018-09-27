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

export default {
  name: 'Paw',

  created() {
    ipcRenderer.send('server-address-request')
    ipcRenderer.on('server-address', (_, { address, port }) => {
      Vue.prototype.$serverAddress = `http://${address}:${port}/`
      this.$router.push({ name: 'home' })
    })
  },
}
</script>

<style lang="scss">
/* CSS */
</style>
