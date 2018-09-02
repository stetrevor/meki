<template>
  <div :class="['progress-bar', { 'progress-bar--colored': colored }]">
    <div :style="progressWidth" 
         class="progress-bar__progress"/>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',

  props: {
    progress: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    colored: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    progressWidth() {
      return `width: ${(this.progress / this.max) * 100}%`
    },
  },
}
</script>

<style lang="scss">
@import '../../theme';

.progress-bar {
  width: 100%;
  height: 8px;
  display: flex;
  overflow: hidden;

  &__progress {
    @include theme-bg-color-background(0.54);
    transition: background-color 100ms
      $mdc-animation-standard-curve-timing-function;
    will-change: background-color;
  }

  &--colored &__progress {
    @include theme-bg-color-secondary();
  }
}
</style>
