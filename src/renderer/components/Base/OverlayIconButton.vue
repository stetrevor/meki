<template>
  <div :class="['overlay-icon-button', { 'overlay-icon-button--active': active }]">
    <svg class="overlay-icon-button__icon">
      <use :xlink:href="`#icon-${icon}`"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'OverlayIconButton',

  props: {
    icon: {
      type: String,
      required: true,
    },

    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
@import '../../theme';

.overlay-icon-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  &__icon {
    width: 100%;
    height: 100%;
    @include theme-text-color-on-primary();
    opacity: 0.54;
    transition: opacity,
      background-color 100ms $mdc-animation-standard-curve-timing-function;
    will-change: opacity;
    position: relative;
  }

  &::before {
    content: '';
    border-radius: 50%;
    width: percentage(16/24);
    height: percentage(16/24);
    position: absolute;
    @include theme-bg-color-primary();
    opacity: 0.38;
    transition: opacity,
      background-color 100ms $mdc-animation-standard-curve-timing-function;
    will-change: opacity, background-color;
  }

  &:hover {
    &::before {
      opacity: 0.54;
    }

    .overlay-icon-button__icon {
      opacity: 1;
    }
  }

  &:active {
    .overlay-icon-button__icon {
      @include theme-text-color-secondary();
    }
  }

  &--active &__icon {
    @include theme-text-color-secondary();
    opacity: 1;
  }
}
</style>
