<template>
  <div class="add-media-menu">
    <div v-for="item in items" 
         :key="item.title" 
         class="add-media-menu__item" 
         @click="$emit('add-media-type', item.mediaType)">
      <base-icon :icon="item.icon" 
                 class="add-media-menu__icon" />
      <div class="add-media-menu__title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
import BaseIcon from '../Base/BaseIcon'

import '../../assets/icons/icon-movie.svg'
import '../../assets/icons/icon-tv.svg'
import '../../assets/icons/icon-folder-filled.svg'
import '../../assets/icons/icon-video.svg'

export default {
  name: 'AddMediaMenu',

  components: { BaseIcon },

  data() {
    return {
      items: [
        { icon: 'movie', title: 'Movie', mediaType: 'movie' },
        { icon: 'tv', title: 'TV Show', mediaType: 'tvshow' },
        { icon: 'folder-filled', title: 'Folder', mediaType: 'folder' },
        { icon: 'video', title: 'Video', mediaType: 'video' },
      ],
    }
  },

  mounted() {
    this.dissmissHandler = e => {
      this.$emit('add-media-menu-dismiss')
    }

    document.body.addEventListener('click', this.dissmissHandler)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.dissmissHandler)
  },
}
</script>

<style lang="scss">
@import '../../theme';

.add-media-menu {
  padding: 8px 0;
  border-radius: 8px;
  @include theme-bg-color-background();
  @include theme-text-color-on-background();

  &__item {
    box-sizing: border-box;
    padding: 8px 16px;
    height: 56px;
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-gap: 16px;
    align-items: center;
    cursor: pointer;
    @include theme-typography-subtitle1();
    will-change: background-color;
    transition: background-color 100ms
      $mdc-animation-sharp-curve-timing-function;

    &:hover {
      background-color: rgba(
        map-get($theme-text-color-map, 'on-background'),
        0.08
      );
    }

    &:focus {
      background-color: rgba(
        map-get($theme-text-color-map, 'on-background'),
        0.24
      );
    }

    &:active {
      background-color: rgba(
        map-get($theme-text-color-map, 'on-background'),
        0.32
      );
    }
  }

  &__icon {
    justify-self: center;
  }

  &__title {
    min-width: 40px * 4;
  }
}
</style>
