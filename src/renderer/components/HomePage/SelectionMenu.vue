<template>
  <div class="selection-menu">
    <div class="selection-menu__item" 
         @click="$emit('select-all')">Select All</div>
    <div class="selection-menu__item" 
         @click="$emit('select-none')">Clear Selection</div>
  </div>
</template>

<script>
export default {
  name: 'SelectionMenu',

  mounted() {
    this.dissmissHandler = e => {
      this.$emit('dismiss')
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

.selection-menu {
  border-radius: 8px;
  overflow: hidden;
  @include theme-bg-color-background();
  display: flex;
  flex-direction: column;
  width: fit-content;
  box-shadow: 0 0 4px 1px $theme-color-primary;
}

.selection-menu__item {
  padding: 0 16px;
  height: 48px;
  @include theme-text-color-on-background();
  @include theme-typography-body2();
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color,
    color 100ms $mdc-animation-standard-curve-timing-function;
  will-change: background-color, color;

  &:hover {
    @include theme-bg-color-primary(0.38);
  }

  &:active {
    @include theme-text-color-on-primary();
    @include theme-bg-color-primary(0.54);
  }
}
</style>
