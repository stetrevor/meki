<template>
  <div class="home-page">
    <div class="home-page__sidebar">
      <svg class="home-page__logo"><use xlink:href="#logo"/></svg>
      <add-media-button class="home-page__amd"/>
      <nav-bar :nav-items="['recents', 'favorites', 'movies', 'tv shows', 'videos', 'private']" 
               class="home-page__nav"/>
      <icon-button class="home-page__settings" 
                   icon="settings"/>
    </div>

    <div class="home-page__toolbar">
      <icon-button icon="search"/>
      <icon-button icon="selection-mode"/>
      <icon-toggle-button icon-normal="fullscreen" 
                          icon-toggled="fullscreen-exit"/>
    </div>

    <div class="home-page__content"/>
  </div>
</template>

<script>
import IconButton from './Base/IconButton'
import IconToggleButton from './Base/IconToggleButton'
import NavBar from './HomePage/NavBar'
import AddMediaButton from './HomePage/AddMediaButton'

import '../assets/logo.svg'
import '../assets/icons/icon-settings.svg'
import '../assets/icons/icon-search.svg'
import '../assets/icons/icon-selection-mode.svg'
import '../assets/icons/icon-fullscreen.svg'
import '../assets/icons/icon-fullscreen-exit.svg'

export default {
  name: 'HomePage',

  components: {
    NavBar,
  },
}
</script>

<style lang="scss">
@import '../theme';

.home-page {
  position: absolute;
  box-sizing: border-box;
  padding: 0 16px 24px 0;
  width: 100%;
  height: 100%;
  @include theme-bg-color-primary();
  display: grid;
  grid-template-columns: 252px 1fr;
  grid-template-rows: 96px 1fr;
}
.home-page__sidebar {
  grid-row: 1 / span 2;
  display: grid;
  grid-template-rows: 196px 64px+24px auto 48px+24px;
  grid-gap: 24px;
}
.home-page__toolbar {
  align-self: center;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  justify-content: end;
}
.home-page__content {
  border-radius: 8px;
  @include theme-bg-color-primary-lighter();
}

.home-page__logo {
  width: 128px;
  height: 128px;
  @include theme-text-color-secondary();
  align-self: center;
  justify-self: center;
}
.home-page__amd {
  justify-self: center;
}
.home-page__nav {
  align-self: start;
}
.home-page__settings {
  align-self: end;
  justify-self: end;
  margin-right: 16px;
}
</style>
