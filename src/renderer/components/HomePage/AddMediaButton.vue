<template>
  <div class="add-media-button theme-text-color-secondary">
    <svg class="add-media-button__icon">
      <use xlink:href="#icon-add"/>
    </svg>

    <span class="add-media-button__text theme-typography-headline4">Add Media</span>
  </div>
</template>

<script>
import '../../assets/icons/icon-add.svg'

export default {
  name: 'AddMediaButton',
}
</script>

<style lang="scss">
@import '../../theme';

.add-media-button {
  box-sizing: border-box;
  border-radius: 8px;
  border: 4px solid;
  width: 216px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: 100ms $mdc-animation-standard-curve-timing-function;

  &:hover {
    @include theme-bg-color-secondary(0.38);
  }

  &:active {
    @include theme-text-color-on-primary;
    @include theme-bg-color-secondary;
    border: none;
  }
}
.add-media-button__icon {
  width: 48px;
  height: 48px;
  margin-right: 8px;
}
.add-media-button__text {
  // Caculate icon padding left and add it to text to make sure icon and text together look center justified.
  padding-right: (48px - 28px) / 2;
  text-transform: uppercase;
}
</style>
