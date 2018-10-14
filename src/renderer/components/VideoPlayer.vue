<template>
  <div v-stream:mousemove="{ subject: mousemove$, options: { capture: true } }" 
       v-stream:mouseup="{ subject: mouseup$, options: { capture: true } }"
       :class="['video-player', { 'video-player--do-not-disturb': !controlsShow$ }]">
    <video ref="video" 
           :src="videoPath"
           crossorigin="anonymous"
           class="video-player__video"
           @timeupdate="progress = $refs.video.currentTime"
           @ended="paused = $refs.video.paused">
      <track v-for="subtitle in video.subtitles" 
             :label="subtitle.label" 
             :srclang="subtitle.lang" 
             :key="subtitle._id" 
             :id="subtitle._id"
             :src="subtitleSrc(subtitle.filePath)" 
             kind="subtitles">
    </video>

    <transition name="fade-out-in" 
                mode="out-in">
      <div v-show="controlsShow$ || paused" 
           class="video-player__controls">
        <div class="video-player__header">
          <icon-button icon="back" 
                       @clicked="exit"/>
          <h5 class="video-player__title">{{ video.title }}</h5>
          <icon-button class="video-player__home" 
                       icon="logo"
                       theme="secondary"
                       @clicked="exit"/>
        </div>

        <overlay-icon-button v-show="paused" 
                             class="video-player__main-action"
                             icon="play"
                             @click.native="play"/>
    
        <div class="video-player__footer">
          <icon-button :toggled="!paused" 
                       icon="play-arrow" 
                       icon-toggled="pause"
                       @clicked="playOrPause"/>
          <base-slider v-stream:value-changed="seek$" 
                       :max="video.runtime"
                       :value="progress"
                       :format="toTime"
                       class="video-player__timeline"/>
          <div class="video-player__progress">
            {{ progress | toTime }} / {{ video.runtime | toTime }}
          </div>
          <div class="video-player__volume-controls">
            <icon-button :toggled="videoMuted" 
                         icon="volume" 
                         icon-toggled="muted"
                         @clicked="videoMuted = $refs.video.muted = !$refs.video.muted"/>
            <base-slider :value="volume"
                         :max="100" 
                         :discrete="true"
                         :format="v => `${v}%`"
                         class="video-player__volume"
                         @value-changed="$refs.video.volume = $event / 100"/>
          </div>

          <icon-button :active="subtitleMenuShow" 
                       icon="subtitle"
                       @click.native.stop
                       @clicked="subtitleMenuShow = !subtitleMenuShow"/>
          <subtitle-menu v-show="subtitleMenuShow" 
                         class="video-player__subtitle-menu"
                         @subtitle-changed="switchSubtitle"
                         @subtitle-before-add="pause"
                         @subtitle-after-add="play"
                         @dismiss="subtitleMenuShow = false"/>

          <fullscreen-toggle/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { merge, of } from 'rxjs'
import {
  mapTo,
  switchMap,
  delay,
  startWith,
  auditTime,
  pluck,
} from 'rxjs/operators'

import { mapState, mapGetters, mapActions } from 'vuex'

import IconButton from './Base/IconButton'
import FullscreenToggle from './Base/FullscreenToggle'
import OverlayIconButton from './Base/OverlayIconButton'
import BaseSlider from './Base/BaseSlider'
import SubtitleMenu from './VideoPlayer/SubtitleMenu'

import { toTime } from '../filters'

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
  name: 'VideoPlayer',

  components: {
    IconButton,
    FullscreenToggle,
    OverlayIconButton,
    BaseSlider,
    SubtitleMenu,
  },

  filters: {
    toTime,
  },

  data() {
    return {
      videoMuted: false,
      paused: true,
      progress: 0,
      subtitleMenuShow: false,
    }
  },

  computed: {
    videoPath() {
      return this.$serverAddress + this.video.filePath
    },

    ...mapState({
      volume: state => state.VideoPlayer.volume,
      muted: state => state.VideoPlayer.muted,
    }),
    ...mapGetters({
      video: 'currentEpisode',
    }),
  },

  mounted() {
    this.progress = this.video.progress || 0
    this.seek(this.progress)
    this.$refs.video.muted = this.videoMuted = this.muted
    this.$refs.video.volume = this.volume / 100
    this.play()
  },

  methods: {
    toTime,

    exit() {
      const progress = this.progress === this.video.runtime ? 0 : this.progress
      const lastWatched = this.progress === this.video.runtime ? new Date() : 0
      const volume = this.$refs.video.volume

      // Unload video
      this.$refs.video.src = ''

      this.updateMedia([[this.video._id], { progress, lastWatched }])
      this.setSoundMuted(this.videoMuted)
      this.setSoundVolume(volume * 100)

      this.$router.push({ name: 'home' })
    },

    seek(value) {
      const video = this.$refs.video

      video.currentTime = value

      return video.paused
        ? Promise.resolve(video.pause())
        : video.play().catch(err => {
            // console.log('error caused by sliding progress bar too fast', err)
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

    pause() {
      const video = this.$refs.video

      video.pause()
      this.paused = video.paused
    },

    playOrPause() {
      if (!this.isPlaying()) {
        this.play()
      } else {
        this.pause()
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

    switchSubtitle(newActiveSubtitleId, oldActiveSubtitleId) {
      const textTracks = this.$refs.video.textTracks

      console.log(...arguments, 'switchSubtitle')

      if (oldActiveSubtitleId)
        textTracks.getTrackById(oldActiveSubtitleId).mode = 'hidden'
      if (newActiveSubtitleId)
        textTracks.getTrackById(newActiveSubtitleId).mode = 'showing'
    },

    subtitleSrc(filePath) {
      return this.$serverAddress + filePath
    },

    ...mapActions(['updateMedia', 'setSoundVolume', 'setSoundMuted']),
  },

  domStreams: ['mousemove$', 'mouseup$', 'seek$'],

  subscriptions() {
    const events$ = merge(this.mousemove$, this.mouseup$).pipe(startWith(null))
    const show$ = events$.pipe(mapTo(true))
    const hide$ = events$.pipe(
      startWith(false),
      switchMap(() => of(false).pipe(delay(5000))),
    )
    const controlsShow$ = merge(show$, hide$)

    this.$subscribeTo(
      this.seek$.pipe(
        auditTime(80),
        pluck('event', 'msg'),
        switchMap(v => this.seek(v)),
      ),
    )

    return { controlsShow$ }
  },
}
</script>

<style lang="scss">
@import '../theme';

.video-player {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: black;

  &--do-not-disturb {
    cursor: none;
  }

  &__video {
    position: absolute;
    width: 100%;
    height: 100%;

    &::cue {
      color: white;
      text-shadow: 0 0 1vh black;
      background: transparent;
      @include theme-typography-cue();
    }
  }

  &__header,
  &__footer {
    position: absolute;
    box-sizing: border-box;
    padding: 0 16px;
    width: 100%;
    height: 96px;
    @include theme-text-color-on-primary();
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 96px + 48px;
      z-index: -1;
    }
  }

  &__header {
    display: flex;
    align-items: center;

    &::before {
      top: 0;
      background: linear-gradient(to bottom, $theme-color-primary, transparent);
    }
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
    display: grid;
    grid-template-columns: auto 1fr minmax(48px * 2, 48px * 3) 48px+8px+48 * 3 auto auto;
    grid-gap: 24px;
    grid-auto-columns: 8px;
    align-items: center;

    &::before {
      bottom: 0;
      background: linear-gradient(to top, $theme-color-primary, transparent);
    }
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

  &__subtitle-menu {
    position: fixed;
    right: 16px;
    bottom: 80px;
  }
}
</style>
