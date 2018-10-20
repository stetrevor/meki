<template>
  <div class="episode-item">
    <div class="episode-item__icon">
      <base-icon :icon="episode.icon"/>
    </div>
    <div class="episode-item__title">{{ episode.title }}</div>
  </div>
</template>

.<script>
import BaseIcon from '../Base/BaseIcon'

export default {
  name: 'EpisodeItem',

  components: { BaseIcon },
  props: {
    episode: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import '../../theme';

.episode-item {
  box-sizing: border-box;
  width: 100%;
  padding: 8px 16px;
  height: 56px;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 16px;
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
}
</style>
