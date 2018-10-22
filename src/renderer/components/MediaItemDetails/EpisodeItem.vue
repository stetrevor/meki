<template>
  <div class="episode-item" 
       @mouseenter="hovered = true" 
       @mouseleave="hovered = false">
    <div class="episode-item__icon">
      <base-icon :icon="episode.icon"/>
    </div>

    <div class="episode-item__title">{{ episode.title }}</div>

    <div v-show="hovered" 
         class="episode-item__info">
      <div class="episode-item__duration">{{ episode.duration | toTime }}</div>
      <progress-bar :progress="episode.progress" 
                    :max="episode.duration" 
                    :colored="true"
                    class="episode-item__progress"/>
      <div class="episode-item__progress-message">{{ progressMsg }}</div>

      <icon-button v-show="episode.progress !== episode.duration" 
                   icon="mark-as-complete"
                   @clicked="$emit('episode-item-mark-as-complete')"/>
      <icon-button :toggled="episode.favorite" 
                   icon="favorite"
                   icon-toggled="favorited"
                   @clicked="$emit('episode-item-favorite')"/>
    </div>
  </div>
</template>

.<script>
import BaseIcon from '../Base/BaseIcon'
import IconButton from '../Base/IconButton'
import ProgressBar from '../Base/ProgressBar'

import { toTime } from '../../filters'

export default {
  name: 'EpisodeItem',

  components: { BaseIcon, IconButton, ProgressBar },

  filters: { toTime },

  props: {
    episode: {
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
    progressMsg() {
      const { progress, duration } = this.episode
      const secLeft = parseInt(duration - progress)
      const minLeft = parseInt((duration - progress) / 60)
      const msg = minLeft ? `${minLeft}m Left` : `${secLeft}s Left`

      return progress === duration ? 'Watched' : msg
    },
  },
}
</script>

<style lang="scss">
@import '../../theme';

.episode-item {
  box-sizing: border-box;
  width: 100%;
  padding: 0 16px;
  height: 56px;
  display: grid;
  grid-template-columns: auto 1fr auto 96px auto auto auto;
  grid-gap: 8px;
  align-items: center;
  @include theme-text-color-on-primary-lighter();
  @include theme-typography-body1();
  transition-property: background-color, color;
  transition-duration: 100ms;
  transition-timing-function: $mdc-animation-sharp-curve-timing-function;

  &:hover {
    background-color: rgba(
      map-get($theme-text-color-map, 'on-primary-lighter'),
      0.08
    );
  }

  &:focus {
    background-color: rgba(
      map-get($theme-text-color-map, 'on-primary-lighter'),
      0.24
    );
  }

  &:active {
    background-color: rgba(
      map-get($theme-text-color-map, 'on-primary-lighter'),
      0.32
    );
  }

  &__icon {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: color, background-color;
    transition-property: color, background-color;
    transition-duration: 100ms;
    transition-timing-function: $mdc-animation-standard-curve-timing-function;
  }

  &__title {
    padding: 0 8px;
  }

  &__info {
    display: contents;
  }

  &__progress-message {
    margin-right: 8px;
    @include theme-typography-subtitle1();
  }
}
</style>
