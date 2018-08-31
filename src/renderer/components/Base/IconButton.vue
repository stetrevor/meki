<template>
  <div class="icon-button">
    <svg class="icon-button__icon">
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
  },
}
</script>

<style lang="scss">
@import '../../theme';

.icon-button {
  border-radius: 8px;
  width: 48px;
  height: 48px;
  @include theme-text-color-on-primary(0.54);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 100ms $mdc-animation-standard-curve-timing-function;
  cursor: pointer;

  &__icon {
    width: 24px;
    height: 24px;
  }

  &:hover {
    @include theme-text-color-on-primary();
    @include theme-bg-color-background(0.38);
  }

  &:active {
    @include theme-bg-color-background(0.54);
  }
}
</style>
