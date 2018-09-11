<template>
  <div class="player-page">
    <video ref="video" 
           class="player-page__video"
           src="http://127.0.0.1:8080/test.mp4"
           @loadedmetadata="duration = Math.floor($refs.video.duration * 1000000)"
           @timeupdate="progress = Math.floor($refs.video.currentTime * 1000000)"/>

    <div class="player-page__header">
      <icon-button icon="back"/>
      <h5 class="player-page__title">Big Bunny</h5>
      <icon-button :colored="true" 
                   class="player-page__home" 
                   icon="logo"/>
    </div>

    <overlay-icon-button v-show="paused" 
                         class="player-page__main-action"
                         icon="play"
                         @click.native="play"/>

    <div class="player-page__footer">
      <icon-toggle-button :toggled="!paused" 
                          icon-normal="play-arrow" 
                          icon-toggled="pause"
                          @click.native="playOrPause"/>
      <player-slider :max="duration" 
                     :value="progress"
                     :format="toTime"
                     class="player-page__timeline"
                     @value-changed="seek"/>
      <div class="player-page__progress">
        {{ progress | toTime }} / {{ duration | toTime }}
      </div>
      <div class="player-page__volume-controls">
        <icon-toggle-button icon-normal="volume" 
                            icon-toggled="muted" 
                            @click.native="$refs.video.muted = !$refs.video.muted"/>
        <player-slider :value="100"
                       :max="100" 
                       :discrete="true"
                       :format="v => `${v}%`"
                       class="player-page__volume"
                       @value-changed="$refs.video.volume = $event / 100"/>
      </div>
      <icon-button icon="subtitle"/>
      <icon-toggle-button icon-normal="fullscreen" 
                          icon-toggled="fullscreen-exit" 
                          @click.native="toggleFullscreen"/>
    </div>
  </div>
</template>

<script>
import IconButton from './Base/IconButton'
import IconToggleButton from './Base/IconToggleButton'
import OverlayIconButton from './Base/OverlayIconButton'
import PlayerSlider from './PlayerPage/PlayerSlider'

import '../assets/icons/icon-back.svg'
import '../assets/icons/icon-logo.svg'
import '../assets/icons/icon-play-arrow.svg'
import '../assets/icons/icon-pause.svg'
import '../assets/icons/icon-volume.svg'
import '../assets/icons/icon-muted.svg'
import '../assets/icons/icon-subtitle.svg'
import '../assets/icons/icon-fullscreen.svg'
import '../assets/icons/icon-fullscreen-exit.svg'
import '../assets/icons/icon-play.svg'

const toTime = function(number) {
  const pad = num => `00${num}`.slice(-2)

  let num = Math.floor(number / 1000) // Total milliseconds
  const milliseconds = num % 1000
  num = (num - milliseconds) / 1000
  const seconds = num % 60
  num = (num - seconds) / 60
  const minutes = num % 60
  const hours = (num - minutes) / 60
  const hoursStr = hours > 0 ? `${hours} : ` : ''
  return `${hoursStr}${pad(minutes)} : ${pad(seconds)}`
}

export default {
  name: 'PlayerPage',

  components: {
    IconButton,
    IconToggleButton,
    OverlayIconButton,
    PlayerSlider,
  },

  filters: {
    toTime,
  },

  data() {
    return {
      paused: true,
      duration: 0,
      progress: 0,
    }
  },

  methods: {
    toTime,

    seek(value) {
      const video = this.$refs.video

      video.pause()
      this.paused = video.paused
      video.currentTime = value / 1000000
      video.play().then(() => {
        this.paused = video.paused
      })
    },

    isPlaying() {
      const video = this.$refs.video
      return (
        video.currentTime > 0 &&
        !video.paused &&
        !video.ended &&
        video.readyState > 2
      )
    },

    play() {
      const video = this.$refs.video

      video.play().then(() => {
        this.paused = video.paused
      })
    },

    playOrPause() {
      const video = this.$refs.video

      if (!this.isPlaying()) {
        this.play()
      } else {
        video.pause()
        this.paused = video.paused
      }
    },

    toggleFullscreen() {
      const el = this.$el
      if (document.webkitFullscreenElement) {
        document.webkitExitFullscreen()
      } else {
        el.webkitRequestFullscreen()
      }
    },
  },
}
</script>

<style lang="scss">
@import '../theme';

.player-page {
  position: relative;
  width: 100vw;
  height: 100vh;

  &__video {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  &__header,
  &__footer {
    position: absolute;
    box-sizing: border-box;
    padding: 0 16px;
    width: 100%;
    height: 96px;
    @include theme-text-color-on-primary();
  }

  &__header {
    background: linear-gradient(to bottom, $theme-color-primary, transparent);
    display: flex;
    align-items: center;
  }

  &__title {
    margin-left: 24px;
    @include theme-typography-headline5();
  }

  &__home {
    margin-left: auto;
  }

  &__main-action {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 24px * 5;
    height: 24px * 5;
    transform: translate(-50%, -50%);
  }

  &__footer {
    bottom: 0;
    background: linear-gradient(to top, $theme-color-primary, transparent);
    display: grid;
    grid-template-columns: auto 1fr minmax(48px * 2, 48px * 3) 48px+8px+48 * 3 auto auto;
    grid-gap: 24px;
    grid-auto-columns: 8px;
    align-items: center;
  }

  &__progress {
    @include theme-typography-body2();
  }

  &__volume-controls {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 8px;
    align-items: center;
  }
}
</style>
