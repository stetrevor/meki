<template>
  <div :class="['folder-item', { 'folder-item--selected': selected }]"
       @mouseenter="hovered = true" 
       @mouseleave="hovered = false">
    <div class="folder-item__icon">
      <transition name="fade-out-in" 
                  mode="out-in">
        <base-icon v-if="selectionMode" 
                   icon="checked"/>
        <base-icon v-else 
                   icon="folder-filled"/>
      </transition>
    </div>

    <div class="folder-item__title">{{ folder.title }}</div>
    <transition name="fade-out-in" 
                mode="out-in">
      <div v-show="!selectionMode && hovered" 
           class="folder-item__actions">
        <icon-button class="folder-item__action-show-in-folder" 
                     icon="folder"/>
        <icon-button class="folder-item__action-favorite" 
                     icon="favorite"/>
      </div>
    </transition>

  </div>
</template>

<script>
import BaseIcon from '../Base/BaseIcon'
import IconButton from '../Base/IconButton'

import '../../assets/icons/icon-folder-filled.svg'
import '../../assets/icons/icon-checked.svg'
import '../../assets/icons/icon-folder.svg'
import '../../assets/icons/icon-favorite.svg'

export default {
  name: 'FolderItem',

  components: { BaseIcon, IconButton },

  props: {
    selectionMode: {
      type: Boolean,
      default: false,
    },

    selected: {
      type: Boolean,
      default: false,
    },

    folder: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      hovered: false,
    }
  },
}
</script>

<style lang="scss">
@import '../../theme';

.folder-item {
  box-sizing: border-box;
  border-radius: 8px;
  padding-left: 16px;
  width: 300px;
  height: 96px;
  @include theme-bg-color-primary();
  @include theme-text-color-on-primary();
  display: grid;
  grid-template-columns: 48px 1fr auto;
  grid-auto-rows: 48px;
  grid-gap: 0 16px;
  align-items: center;

  &--selected &__icon {
    @include theme-bg-color-secondary();
    @include theme-text-color-primary();
  }

  &__icon {
    grid-row: 1 / span 2;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    @include theme-bg-color-background(0.32);
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: color, background-color;
    transition-property: color, background-color;
    transition-duration: 100ms;
    transition-timing-function: $mdc-animation-standard-curve-timing-function;
  }

  &__title {
    grid-row: 1 / span 2;
    max-height: 64px;
    overflow: scroll;
    @include theme-typography-body1();
  }

  &__actions {
    display: contents;
  }

  &__action-show-in-folder {
    border-radius: 0 8px 0 8px;
  }

  &__action-favorite {
    grid-row: 2 / 3;
    border-radius: 8px 0 8px 0;
  }
}
</style>
