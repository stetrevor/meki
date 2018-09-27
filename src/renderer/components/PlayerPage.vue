<template>
  <div v-stream:mousemove="{ subject: mousemove$, options: { capture: true } }" 
       v-stream:mouseup="{ subject: mouseup$, options: { capture: true } }"
       :class="['player-page', { 'player-page--do-not-disturb': !controlsShow$ }]">
    <video ref="video" 
           :src="videoPath"
           class="player-page__video"
           @timeupdate="progress = $refs.video.currentTime"/>

    <transition name="fade-out-in" 
                mode="out-in">
      <div v-show="controlsShow$ || paused" 
           class="player-page__controls">
        <div class="player-page__header">
          <icon-button icon="back" 
                       @click.native="exit"/>
          <h5 class="player-page__title">{{ video.title }}</h5>
          <icon-button :colored="true" 
                       class="player-page__home" 
                       icon="logo"
                       @click.native="exit"/>
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
          <player-slider v-stream:value-changed="seek$" 
                         :max="duration"
                         :value="progress"
                         :format="toTime"
                         class="player-page__timeline"/>
          <div class="player-page__progress">
            {{ progress | toTime }} / {{ duration | toTime }}
          </div>
          <div class="player-page__volume-controls">
            <icon-toggle-button :toggled="videoMuted" 
                                icon-normal="volume" 
                                icon-toggled="muted"
                                @click.native="videoMuted = $refs.video.muted = !$refs.video.muted"/>
            <player-slider :value="volume"
                           :max="100" 
                           :discrete="true"
                           :format="v => `${v}%`"
                           class="player-page__volume"
                           @value-changed="$refs.video.volume = $event / 100"/>
          </div>

          <icon-button :active="subtitleMenuShow" 
                       icon="subtitle"
                       @click.native.stop="subtitleMenuShow = !subtitleMenuShow"/>
          <subtitle-menu v-show="subtitleMenuShow" 
                         :subtitles="subtitles"
                         class="player-page__subtitle-menu"
                         @active-subtitle-changed="setActiveSubtitle"
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

import { mapState, mapActions } from 'vuex'

import IconButton from './Base/IconButton'
import IconToggleButton from './Base/IconToggleButton'
import FullscreenToggle from './Base/FullscreenToggle'
import OverlayIconButton from './Base/OverlayIconButton'
import PlayerSlider from './PlayerPage/PlayerSlider'
import SubtitleMenu from './PlayerPage/SubtitleMenu'

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

  let num = Math.floor(number * 1000) // Total milliseconds
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
    FullscreenToggle,
    OverlayIconButton,
    PlayerSlider,
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
      subtitles: [
        { _id: '1', default: false, title: 'English', lang: 'en' },
        { _id: '2', default: true, title: 'English 2', lang: 'en' },
        { _id: '3', default: false, title: 'Chinese', lang: 'cn' },
      ],
    }
  },

  computed: {
    videoPath() {
      return this.$serverAddress + this.video.filePath
    },

    ...mapState({
      video: 'currentPlayingEpisode',
      volume: state => state.PlayerPage.volume,
      muted: state => state.PlayerPage.muted,
    }),
  },

  mounted() {
    this.duration = this.video.runtime
    this.progress = this.video.progress
    this.seek(this.progress)
    this.$refs.video.muted = this.videoMuted = this.muted
    this.$refs.video.volume = this.volume
  },

  methods: {
    toTime,

    exit() {
      const progress = this.progress === this.video.duration ? 0 : this.progress
      const lastWatched = this.progress === this.video.duration ? new Date() : 0
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
      return video
        .play()
        .then(() => (this.paused = video.paused))
        .catch(err =>
          console.log('error caused by sliding progress bar too fast', err),
        )
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

    setActiveSubtitle(subtitle) {
      const oldIndex = this.subtitles.findIndex(s => s.default)
      const old = this.subtitles[oldIndex]
      this.subtitles.splice(
        oldIndex,
        1,
        Object.assign({}, old, { default: false }),
      )

      const index = this.subtitles.findIndex(s => s._id === subtitle._id)
      this.subtitles.splice(
        index,
        1,
        Object.assign({}, subtitle, { default: true }),
      )

      console.log(
        Object.assign({}, old, { default: false }),
        Object.assign({}, subtitle, { default: true }),
      )
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

.player-page {
  position: relative;
  width: 100vw;
  height: 100vh;

  &--do-not-disturb {
    cursor: none;
  }

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
