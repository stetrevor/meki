<template>
  <div class="app-color">
    <div class="app-color__color app-color__color--primary">Text on Primary</div>
    <div class="app-color__color app-color__color--primary-lighter">Text on Primary Lighter</div>
    <div class="app-color__color app-color__color--secondary">Text on Secondary</div>
    <div class="app-color__color app-color__color--background">Text on Background</div>
  </div>
</template>

<script>
export default {
  name: 'AppColor',
}
</script>

<style lang="scss">
@import '../theme.scss';

body {
  margin: 0;
  padding: 0;
}
.app-color {
  background-color: black;
  position: absolute;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 20px;
  justify-items: center;
}
.app-color__color {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.app-color__color--primary {
  @include theme-text-color-on-primary;
  @include theme-bg-color-primary;
}
.app-color__color--primary-lighter {
  @include theme-text-color-on-primary-lighter;
  @include theme-bg-color-primary-lighter;
}
.app-color__color--secondary {
  @include theme-text-color-on-secondary;
  @include theme-bg-color-secondary;
}
.app-color__color--background {
  @include theme-text-color-on-background;
  @include theme-bg-color-background;
}
</style>
