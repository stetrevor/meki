<template>
  <div class="splash-screen">
    <svg class="splash-screen__logo">
      <use xlink:href="#logo"/>
    </svg>
  </div>
</template>

<script>
import '../assets/logo.svg'

export default {
  name: 'SplashScreen',
}
</script>

<style lang="scss">
@import '../theme';

.splash-screen {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @include theme-text-color-secondary();
  @include theme-bg-color-primary();

  &__logo {
    width: 192px;
    height: 288px;
  }
}
</style>
