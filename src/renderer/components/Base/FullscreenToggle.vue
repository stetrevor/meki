<template>
  <icon-toggle-button :toggled="fullscreen" 
                      class="fullscreen-toggle"
                      icon-normal="fullscreen" 
                      icon-toggled="fullscreen-exit"
                      @click.native="toggleFullscreen"/>
</template>

<script>
import { remote } from 'electron'

import { mapGetters, mapActions } from 'vuex'

import IconToggleButton from './IconToggleButton'

import '../../assets/icons/icon-fullscreen.svg'
import '../../assets/icons/icon-fullscreen-exit.svg'

export default {
  name: 'FullscreenToggle',

  components: { IconToggleButton },

  computed: mapGetters(['fullscreen']),

  methods: mapActions(['toggleFullscreen']),
}
</script>
