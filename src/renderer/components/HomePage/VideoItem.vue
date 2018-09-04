<template>
  <div :class="['video-item', { 'video-item--expanded': expanded, 'video-item--selection-mode': selectionMode, 'video-item--selected': selected }]" 
       @mouseenter="hovered = true" 
       @mouseleave="hovered = false">
    <img src="https://placekitten.com/300/200" 
         class="video-item__thumbnail">

    <transition name="fade-out-in" 
                mode="out-in">
      <div v-if="!expanded" 
           key="folded"
           :class="['video-item__folded', { 'video-item__folded--active' : hovered }]" >
        <progress-bar :colored="hovered" 
                      :progress="32"
                      :max="100" 
                      class="video-item__progress-bar theme-bg-color-primary"/>
        <p :class="['video-item__title', { 'video-item__title--active': hovered }]">Video Title</p>
      </div>
    
      <div v-else 
           key="expanded"
           class="video-item__expanded">
        <div class="video-item__info">
          <div class="video-item__title video-item__title--expanded">Video Title That's Very Long But Now It Can Show All Lines</div>
          <progress-bar :progress="32" 
                        :max="100" 
                        :colored="true"
                        class="video-item__progress-bar video-item__progress-bar--expanded"/>
          <div class="video-item__runtime-left">12m Left</div>
          <div class="video-item__runtime">22m34s</div>
          <div class="video-item__date-added">Added on 2018-08-21 2:53 PM</div>
        </div>

        <transition name="fade-out-in" 
                    mode="out-in">
          <div v-show="!selectionMode && hovered" 
               class="video-item__toolbar">
            <icon-toggle-button icon-normal="favorite" 
                                icon-toggled="favorited"/>
            <icon-toggle-button icon-normal="mark-watched" 
                                icon-toggled="watched"/>
            <icon-button icon="folder"/>
          </div>
        </transition>

      </div>
    </transition>

    <transition name="fade-out-in" 
                mode="out-in">
      <overlay-icon-button :class="['video-item__main-action', { 'video-item__main-action--active': hovered || selectionMode, 'video-item__main-action--expanded': expanded, 'video-item__main-action--selection-mode': selectionMode }]" 
                           :icon="selectionMode ? 'selection-mode' : 'play'"
                           :active="selected"
                           :key="`${selectionMode}${expanded}`" 
                           @click.native="mainActionHandler"/> <!-- icon: play big, play, selection-mode -->
    </transition>

    <transition name="fade-out-in" 
                mode="out-in">
      <icon-toggle-button class="video-item__expand-toggle" 
                          icon-normal="expand"
                          icon-toggled="fold"
                          @click.native="expanded = !expanded"/>
    </transition>

  </div>
</template>

<script>
import IconButton from '../Base/IconButton'
import IconToggleButton from '../Base/IconToggleButton'
import OverlayIconButton from '../Base/OverlayIconButton'
import ProgressBar from '../Base/ProgressBar'

import '../../assets/icons/icon-expand.svg'
import '../../assets/icons/icon-fold.svg'
import '../../assets/icons/icon-favorite.svg'
import '../../assets/icons/icon-favorited.svg'
import '../../assets/icons/icon-mark-watched.svg'
import '../../assets/icons/icon-watched.svg'
import '../../assets/icons/icon-folder.svg'
import '../../assets/icons/icon-play.svg'
import '../../assets/icons/icon-selection-mode.svg'

export default {
  name: 'VideoItem',

  components: {
    IconButton,
    IconToggleButton,
    OverlayIconButton,
    ProgressBar,
  },

  props: {
    selectionMode: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      expanded: false,
      hovered: false,
      selected: false,
    }
  },

  watch: {
    selectionMode(mode) {
      if (!mode) {
        this.selected = false
      }
    },
  },

  methods: {
    mainActionHandler() {
      if (this.selectionMode) {
        this.selected = !this.selected
        const eventName = this.selected
          ? 'video-item-selected'
          : 'video-item-deselected'
        this.$emit(eventName)
      } else {
        this.$emit('video-item-play')
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

  &__thumbnail {
    grid-column: 1 / span 2;
    grid-row: 1 / 2;
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
  }

  &__title {
    grid-column: 1 / 2;
    @include theme-typography-body1();
    @include theme-text-color-on-primary();
    align-self: center;
    margin-left: 16px;
    opacity: 0.54;
    transition: opacity 100ms $mdc-animation-standard-curve-timing-function;
    will-change: opacity;
  }

  &__title--active {
    opacity: 1;
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
    grid-template-rows: 1fr 48px;
  }

  &__info {
    grid-row: 1 / span 2;
    padding: 16px;
    margin-top: 24px+48px;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: repeat(4, min-content);
    grid-gap: 16px 8px;
    overflow: scroll;
    @include theme-text-color-on-primary();
  }

  &__title--expanded {
    grid-column: 1 / span 2;
    margin: 0;
    opacity: 1;
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
    grid-row: 1 / 2;
    display: grid;
    align-content: end;
  }

  &__toolbar * {
    border-radius: 8px 0 0 8px;
  }

  &__main-action {
    grid-column: 1 / span 2;
    grid-row: 1 / 2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center center;
    transform: translate(-50%, -50%) scale(4);
    visibility: hidden;
  }

  &__main-action--active {
    visibility: visible;
  }

  &__main-action--expanded {
    top: 0;
    left: 0;
    transform: scale(2) translate(12px, 12px);
  }

  &__main-action--selection-mode {
    top: 0;
    left: 0;
    transform: scale(2) translate(12px, 12px);
  }

  &__expand-toggle {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 8px 0 8px 0;
  }
}
</style>
