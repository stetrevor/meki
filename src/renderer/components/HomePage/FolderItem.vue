<template>
  <div class="folder-item">
    <div class="folder-item__icon">
      <base-icon icon="folder-filled"/>
    </div>
    <div class="folder-item__title">A Very Long Folder Name That Will Cause Text Ellipsis To Show Up</div>
    <div class="folder-item__actions">
      <icon-button class="folder-item__action-show-in-fs" 
                   icon="folder"/>
      <icon-button class="folder-item__action-favorite" 
                   icon="favorite"/>
    </div>
  </div>
</template>

<script>
import BaseIcon from '../Base/BaseIcon'
import IconButton from '../Base/IconButton'

import '../../assets/icons/icon-folder-filled.svg'
import '../../assets/icons/icon-folder.svg'
import '../../assets/icons/icon-favorite.svg'

export default {
  name: 'FolderItem',

  components: { BaseIcon, IconButton },
}
</script>

<style lang="scss">
@import '../../theme';

.folder-item {
  border-radius: 8px;
  padding-left: 16px;
  width: 300px;
  height: 96px;
  @include theme-bg-color-primary-lighter();
  @include theme-text-color-on-primary-lighter();
  display: grid;
  grid-template-columns: 48px 1fr auto;
  grid-auto-rows: 48px;
  grid-gap: 0 16px;
  align-items: center;

  &__icon {
    grid-row: 1 / span 2;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    @include theme-bg-color-background(0.32);
    display: flex;
    align-items: center;
    justify-content: center;
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

  &__action-show-in-fs {
    border-radius: 0 8px 0 8px;
  }

  &__action-favorite {
    grid-row: 2 / 3;
    border-radius: 8px 0 8px 0;
  }
}
</style>
