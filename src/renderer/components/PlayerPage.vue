<template>
  <div class="player-page">
    <video ref="video" 
           class="player-page__video"
           src="http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4"/>

    <div class="player-page__header">
      <icon-button icon="back"/>
      <h5 class="player-page__title">Big Bunny</h5>
      <icon-button :colored="true" 
                   class="player-page__home" 
                   icon="logo"/>
    </div>

    <overlay-icon-button v-show="paused" 
                         class="player-page__main-action"
                         icon="play"/>

    <div class="player-page__footer">
      <icon-toggle-button icon-normal="play-arrow" 
                          icon-toggled="pause" 
                          @click.native="$refs.video.paused ? $refs.video.play() : $refs.video.pause(); paused = $refs.video.paused"/>
      <progress-bar :interactive="true" 
                    :colored="true" 
                    :progress="32"
                    :max="120" 
                    class="player-page__timeline"/>
      <div class="player-page__progress">
        89 : 54 / 102 : 37
      </div>
      <div class="player-page__volume-controls">
        <icon-toggle-button icon-normal="volume" 
                            icon-toggled="muted"/>
        <progress-bar :interactive="true" 
                      :colored="true" 
                      :progress="75"
                      :max="100" 
                      class="player-page__volume"/>
      </div>
      <icon-button icon="subtitle"/>
      <icon-toggle-button icon-normal="fullscreen" 
                          icon-toggled="fullscreen-exit"/>
    </div>
  </div>
</template>

<script>
import IconButton from './Base/IconButton'
import IconToggleButton from './Base/IconToggleButton'
import OverlayIconButton from './Base/OverlayIconButton'
import ProgressBar from './Base/ProgressBar'

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

export default {
  name: 'PlayerPage',

  components: {
    IconButton,
    IconToggleButton,
    OverlayIconButton,
    ProgressBar,
  },

  data() {
    return {
      paused: true,
    }
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
    grid-template-columns: auto 5fr minmax(48px * 2, 48px * 3) 1fr auto auto;
    grid-gap: 24px;
    grid-auto-columns: 8px;
    align-items: center;
  }

  &__timeline,
  &__volume {
    border-radius: 2px;
    @include theme-bg-color-background();
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
