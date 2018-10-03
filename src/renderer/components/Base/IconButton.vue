<template>
  <div :class="['icon-button', { 'icon-button--colored': colored, 'icon-button--active': active }]">
    <svg :class="['icon-button__icon', { 'icon-button__icon--active': active }]">
      <use :xlink:href="`#icon-${icon}`"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'IconButton',

  props: {
    icon: {
      type: String,
      required: true,
    },

    colored: {
      type: Boolean,
      default: false,
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

.icon-button {
  border-radius: 8px;
  overflow: hidden;
  width: 48px;
  height: 48px;
  @include theme-text-color-on-primary();
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: opacity, color 100ms $mdc-animation-standard-curve-timing-function;
  will-change: opacity, color;

  &__icon {
    width: 24px;
    height: 24px;
    opacity: 0.54;
    position: relative;
  }

  &::before {
    content: '';
    width: 48px;
    height: 48px;
    position: absolute;
    @include theme-bg-color-background();
    opacity: 0;
    transition: opacity 100ms $mdc-animation-standard-curve-timing-function;
    will-change: opacity;
  }

  &:hover {
    &::before {
      opacity: 0.38;
    }

    .icon-button__icon {
      opacity: 1;
    }
  }

  &:active {
    &::before {
      opacity: 0.54;
    }
  }

  &--colored {
    @include theme-text-color-secondary();

    &:hover::before {
      @include theme-bg-color-secondary();
    }

    &:active::before {
      opacity: 0.54;
    }
  }

  &--active {
    &::before {
      opacity: 0.54;
    }
  }

  &__icon--active {
    opacity: 1;
  }
}
</style>
