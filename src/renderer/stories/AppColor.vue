<template>
  <div class="app-color">
    <div class="app-color__color app-color__color--primary">Primary</div>
    <div class="app-color__color app-color__color--primary-lighter">Primary Lighter</div>
    <div class="app-color__color app-color__color--secondary">Secondary</div>
    <div class="app-color__color app-color__color--background">Background</div>
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
  background-color: $theme-color-primary;
  color: $theme-color-background;
}
.app-color__color--primary-lighter {
  background-color: $theme-color-primary-lighter;
  color: $theme-color-background;
}
.app-color__color--secondary {
  background-color: $theme-color-secondary;
  color: $theme-color-background;
}
.app-color__color--background {
  background-color: $theme-color-background;
  color: $theme-color-primary;
}
</style>
