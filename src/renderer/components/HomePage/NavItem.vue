<template>
  <div class="nav-item">
    <h3 class="nav-item__text"><slot/></h3>
  </div>
</template>

<script>
export default {
  name: 'NavItem',
}
</script>

<style lang="scss">
@import '../../theme';

.nav-item {
  margin-left: 56px;
  width: 100%;
  height: 48px;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  position: relative;
  cursor: pointer;

  &__text {
    @include theme-typography-headline3();
    @include theme-text-color-on-primary();
    opacity: 0.54;
    transition: opacity 100ms $mdc-animation-standard-curve-timing-function;
    will-change: opacity;
  }

  &::before {
    content: '';
    border-radius: 8px;
    width: 16px;
    height: 48px;
    @include theme-bg-color-secondary();
    position: absolute;
    left: -64px;
    opacity: 0;
    transition: opacity 100ms $mdc-animation-standard-curve-timing-function;
    will-change: opacity;
  }

  &:hover {
    .nav-item__text {
      opacity: 1;
    }
  }

  &--active {
    .nav-item__text {
      opacity: 1;
    }
    &::before {
      opacity: 1;
    }
  }
}
</style>
