<template>
  <div :class="['video-item', { 'video-item--expanded': hovered, 'video-item--selection-mode': selectionMode, 'video-item--selected': selected }]" 
       @mouseenter="ready ? hovered = true : ''" 
       @mouseleave="ready ? hovered = false : ''">
    <div class="video-item__thumbnail-container">
      <transition name="fade-out-in" 
                  mode="out-in">
        <img v-if="ready" 
             :src="thumbnailPath" 
             class="video-item__thumbnail">
      </transition>
    </div>

    <transition name="fade-out-in" 
                mode="out-in">
      <div v-if="hovered || (ready && selectionMode)" 
           key="expanded"
           class="video-item__expanded">
        <overlay-icon-button :icon="selectionMode ? 'selection-mode' : 'play'" 
                             :active="selected"
                             class="video-item__main-action"
                             @click.native="mainActionHandler"/>
    
        <div class="video-item__info">
          <div class="video-item__title video-item__title--expanded">{{ mediaItem.title }}</div>
          <progress-bar v-if="mediaItem.progress || mediaItem.lastWatched"
                        :progress="mediaItem.progress || mediaItem.duration" 
                        :max="mediaItem.duration" 
                        :colored="true"
                        class="video-item__progress-bar video-item__progress-bar--expanded"/>
          <div v-if="mediaItem.progress || mediaItem.lastWatched"
               class="video-item__progress-message">{{ progressMsg }}</div>
          <div class="video-item__duration">{{ mediaItem.duration | toTime }}</div>
          <div class="video-item__date-added">Added on {{ mediaItem.createdAt | toDate }}</div>
        </div>

        <div class="video-item__toolbar">
          <icon-button v-show="!selectionMode && hovered" 
                       icon="folder"
                       @clicked="$emit('media-item-show-in-folder')"/>
          <icon-button v-if="!selectionMode && mediaItem.progress !== mediaItem.duration" 
                       icon="mark-as-complete"
                       @clicked="$emit('media-item-mark-as-complete')"/>
          <icon-button :toggled="mediaItem.favorite" 
                       :disabled="selectionMode"
                       icon="favorite"
                       icon-toggled="favorited"
                       @clicked="$emit('media-item-favorite')"/>
        </div>
      </div>

      <div v-else
           key="folded"
           class="video-item__folded" >
        <progress-bar v-if="mediaItem.progress || mediaItem.lastWatched" 
                      :colored="true" 
                      :progress="mediaItem.progress || mediaItem.duration"
                      :max="mediaItem.duration" 
                      class="video-item__progress-bar"/>
        <p class="video-item__title">{{ mediaItem.title }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import IconButton from '../Base/IconButton'
import OverlayIconButton from '../Base/OverlayIconButton'
import ProgressBar from '../Base/ProgressBar'

import { toTime } from '../../filters'

import '../../assets/icons/icon-favorite.svg'
import '../../assets/icons/icon-favorited.svg'
import '../../assets/icons/icon-mark-as-complete.svg'
import '../../assets/icons/icon-folder.svg'
import '../../assets/icons/icon-play.svg'
import '../../assets/icons/icon-selection-mode.svg'

export default {
  name: 'VideoItem',

  components: {
    IconButton,
    OverlayIconButton,
    ProgressBar,
  },

  filters: {
    toDate(milliseconds) {
      return new Date(milliseconds).toLocaleString()
    },

    toTime,
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

    mediaItem: {
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
      return this.ready
        ? this.$serverAddress +
            this.$thumbnailDir +
            this.mediaItem.thumbnailPath
        : ''
    },

    progressMsg() {
      const duration = this.mediaItem.duration
      const progress = this.mediaItem.progress || 0
      const lastWatched = this.mediaItem.lastWatched || 0
      const secLeft = parseInt(duration - progress)
      const minLeft = parseInt((duration - progress) / 60)
      const msg = minLeft ? `${minLeft}m Left` : `${secLeft}s Left`

      return lastWatched ? 'Watched' : msg
    },

    ready() {
      return !!(this.mediaItem.duration && this.mediaItem.thumbnailPath)
    },
  },

  methods: {
    mainActionHandler() {
      if (this.selectionMode) {
        const eventName = this.selected
          ? 'media-item-deselected'
          : 'media-item-selected'
        this.$emit(eventName)
      } else {
        this.$emit('media-item-open')
      }
    },
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
    grid-column: 1 / -1;
    grid-row: 2 / 3;
    @include theme-typography-body1();
    @include theme-text-color-on-primary();
    align-self: center;
    margin: 0 16px;
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

  &__progress-message {
    grid-column: 2 / 3;
    align-self: center;
    @include theme-typography-subtitle1();
  }

  &__duration,
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
    z-index: 1;
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
