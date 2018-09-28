<template>
  <div :class="['video-item', { 'video-item--expanded': hovered, 'video-item--selection-mode': selectionMode, 'video-item--selected': selected }]" 
       @mouseenter="hovered = true" 
       @mouseleave="hovered = false">
    <div class="video-item__thumbnail-container">
      <transition name="fade-out-in" 
                  mode="out-in">
        <img v-if="video.backdropPath" 
             :src="thumbnailPath" 
             class="video-item__thumbnail">
      </transition>
    </div>

    <transition name="fade-out-in" 
                mode="out-in">
      <div v-if="hovered || selectionMode" 
           key="expanded"
           class="video-item__expanded">
        <overlay-icon-button :icon="selectionMode ? 'selection-mode' : 'play'" 
                             :active="selected"
                             class="video-item__main-action"
                             @click.native="mainActionHandler"/>
    
        <div class="video-item__info">
          <div class="video-item__title video-item__title--expanded">{{ video.title }}</div>
          <progress-bar v-if="video.progress"
                        :progress="video.progress" 
                        :max="video.runtime" 
                        :colored="true"
                        class="video-item__progress-bar video-item__progress-bar--expanded"/>
          <div v-if="video.progress" 
               class="video-item__runtime-left">{{ (video.runtime - video.progress) | toTime('m Left') }}</div>
          <div class="video-item__runtime">{{ video.runtime | toTime('m') }}</div>
          <div class="video-item__date-added">Added on {{ video.createdAt | toDate }}</div>
        </div>

        <div class="video-item__toolbar">
          <icon-button v-show="!selectionMode && hovered" 
                       icon="folder"
                       @click.native="showInFolder"/>
          <icon-toggle-button :toggled="!!video.lastWatched" 
                              :disabled="selectionMode"
                              icon-normal="mark-watched"
                              icon-toggled="watched"
                              @clicked="updateMedia([[video._id], { lastWatched: video.lastWatched ? 0 : new Date(), progress: 0 }])"/>
          <icon-toggle-button :toggled="video.favorite" 
                              :disabled="selectionMode"
                              icon-normal="favorite"
                              icon-toggled="favorited"
                              @clicked="updateMedia([[video._id], { favorite: !video.favorite }])"/>
        </div>
      </div>

      <div v-else
           key="folded"
           class="video-item__folded" >
        <progress-bar v-if="video.progress || video.lastWatched" 
                      :max="video.runtime" 
                      class="video-item__progress-bar"/>
        <p class="video-item__title">{{ video.title }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { shell, remote } from 'electron'

import path from 'path'

import { mapActions } from 'vuex'

import IconButton from '../Base/IconButton'
import IconToggleButton from '../Base/IconToggleButton'
import OverlayIconButton from '../Base/OverlayIconButton'
import ProgressBar from '../Base/ProgressBar'

import '../../assets/icons/icon-favorite.svg'
import '../../assets/icons/icon-favorited.svg'
import '../../assets/icons/icon-mark-watched.svg'
import '../../assets/icons/icon-watched.svg'
import '../../assets/icons/icon-folder.svg'
import '../../assets/icons/icon-play.svg'
import '../../assets/icons/icon-selection-mode.svg'

const base =
  process.env.NODE_ENV === 'production'
    ? path.join(remote.app.getPath('userData'), 'images')
    : path.resolve(__dirname, '../../../../temp', 'images')

export default {
  name: 'VideoItem',

  components: {
    IconButton,
    IconToggleButton,
    OverlayIconButton,
    ProgressBar,
  },

  filters: {
    toTime(seconds, string) {
      const minutes = parseInt(seconds / 60)
      return `${minutes}${string}`
    },

    toDate(milliseconds) {
      return new Date(milliseconds).toLocaleString()
    },
  },

  props: {
    selectionMode: {
      type: Boolean,
      default: false,
    },

    selected: {
      type: Boolean,
      default: false,
    },

    video: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      hovered: false,
    }
  },

  computed: {
    thumbnailPath() {
      return this.$serverAddress + path.resolve(base, this.video.backdropPath)
    },
  },

  methods: {
    mainActionHandler() {
      if (this.selectionMode) {
        const eventName = this.selected
          ? 'video-item-deselected'
          : 'video-item-selected'
        this.$emit(eventName)
      } else {
        this.$emit('video-item-play')
      }
    },

    showInFolder() {
      shell.showItemInFolder(this.video.filePath)
    },

    ...mapActions(['updateMedia']),
  },
}
</script>

<style lang="scss">
@import '../../theme';

.video-item {
  border-radius: 8px;
  width: 3 * 100px;
  height: 2 * 100px + 8px + 48px;
  overflow: hidden;
  position: relative;
  @include theme-bg-color-primary();
  display: grid;
  grid-template-columns: 1fr 48px;
  grid-template-rows: 1fr 8px 48px;
  transition: box-shadow 100ms $mdc-animation-standard-curve-timing-function;
  will-change: box-shadow;

  &--selected {
    box-shadow: 0 0 0 4px $theme-color-secondary;
  }

  &__thumbnail-container {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba($theme-color-background, 0.54),
      rgba($theme-color-secondary, 0.54)
    );
  }

  &__thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__folded {
    grid-column: 1 / -1;
    grid-row: 2 / -1;
    display: grid;
    grid-template-columns: 1fr 48px;
    grid-template-rows: 8px 48px;
  }

  &__progress-bar {
    grid-column: 1 / span 2;
    @include theme-bg-color-primary(0.54);
  }

  &__title {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    @include theme-typography-body1();
    @include theme-text-color-on-primary();
    align-self: center;
    margin-left: 16px;
    opacity: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &__expanded {
    background: linear-gradient(
      to top,
      $theme-color-primary 56px,
      rgba($theme-color-primary, 0.38)
    );
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 48px;
    grid-template-rows: 48px 1fr;
    grid-gap: 16px;
    padding: 16px 0 0 16px;
  }

  &__info {
    grid-row: 2 / -1;
    padding-bottom: 16px;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: repeat(4, min-content);
    grid-gap: 16px 8px;
    overflow: scroll;
    @include theme-text-color-on-primary();
  }

  &__title--expanded {
    grid-column: 1 / span 2;
    grid-row: 1 / 2;
    margin: 0;
    opacity: 1;
    white-space: normal;
    overflow-wrap: break-word;
  }

  &__progress-bar--expanded {
    grid-column: 1 / 2;
    align-self: center;
    border-radius: 2px;
    @include theme-bg-color-background();
  }

  &__runtime-left {
    grid-column: 2 / 3;
    align-self: center;
    @include theme-typography-subtitle1();
  }

  &__runtime,
  &__date-added {
    grid-column: 1 / span 2;
    align-self: center;
    @include theme-typography-body2();
  }

  &__toolbar {
    grid-column: 2 / 3;
    grid-row: 1 / -1;
    display: grid;
    align-content: end;
  }

  &__toolbar * {
    border-radius: 8px 0 0 8px;

    &:last-child {
      border-radius: 8px 0 8px 0;
    }
  }

  &__main-action {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    transform-origin: top left;
    transform: scale(2);
  }
}
</style>
