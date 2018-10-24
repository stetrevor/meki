<template>
  <icon-button :toggled="fullscreen" 
               class="fullscreen-toggle"
               icon="fullscreen" 
               icon-toggled="fullscreen-exit"
               @click.native="toggleFullscreen"/>
</template>

<script>
import { remote } from 'electron'

import { mapGetters, mapActions } from 'vuex'

import IconButton from './IconButton'

export default {
  name: 'FullscreenToggle',

  components: { IconButton },

  computed: mapGetters(['fullscreen']),

  methods: mapActions(['toggleFullscreen']),
}
</script>
