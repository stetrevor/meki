<template>
  <div class="splash-screen theme-bg-color-primary theme-text-color-secondary">
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
.splash-screen {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.splash-screen__logo {
  width: 192px;
  height: 288px;
}
</style>
