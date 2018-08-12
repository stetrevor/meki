<template>
  <div class="app-theme">
    <div class="app-theme__color mdc-theme--primary-bg mdc-theme--on-primary">Primary</div>
    <div class="app-theme__color mdc-theme--secondary-bg mdc-theme--on-secondary">Secondary</div>
    <div class="app-theme__color mdc-theme--surface mdc-theme--on-surface">Surface</div>
    <div class="app-theme__color mdc-theme--background mdc-theme--on-background">Background</div>
  </div>
</template>

<script>
export default {
  name: 'AppTheme',
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
.app-theme {
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
.app-theme__color {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
