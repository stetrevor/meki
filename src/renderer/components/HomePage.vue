<template>
  <div class="home-page">
    <div class="home-page__sidebar">
      <svg class="home-page__logo"><use xlink:href="#logo"/></svg>
      <add-media-button class="home-page__amd" 
                        @click.native="showAddMediaDialog"/>
      <nav-bar :nav-items="navItems" 
               class="home-page__nav"
               @active-nav-item-changed="navItemChanged"/>
      <icon-button class="home-page__settings" 
                   icon="settings"/>
    </div>

    <transition name="fade-out-in" 
                mode="out-in">

      <div v-if="selectionMode"
           key="selection-mode" 
           class="home-page__selection-toolbar">
        <icon-button icon="cancel" 
                     class="home-page__selection-mode-exit"
                     @click.native="selectionMode = false; selectedItems = []"/>
        <div class="home-page__selection-toolbar-title">{{ selectedItems.length }} Selected</div>
        <icon-toggle-button icon-normal="favorite" 
                            icon-toggled="favorited"/>
        <icon-toggle-button icon-normal="mark-watched" 
                            icon-toggled="watched"/>

        <transition name="fade-out-in" 
                    mode="out-in">
          <icon-button v-show="selectedItems.length" 
                       icon="delete"
                       @click.native="showDeleteDialog"/>
        </transition>

        <icon-button icon="more" 
                     @click.native.stop="selectionMenu = true"/>

        <transition name="fade-out-in">
          <selection-menu v-if="selectionMenu" 
                          class="home-page__selection-toolbar-menu"
                          @select-all="selectAll = true; selectedItems = videos"
                          @select-none="selectAll = false; selectedItems = []"
                          @dismiss="selectionMenu = false"/>
        </transition>
      </div>

      <div v-else 
           key="normal-mode" 
           class="home-page__toolbar">
        <icon-button icon="search"/>
        <icon-button icon="selection-mode" 
                     @click.native="selectionMode = true"/>
        <fullscreen-toggle/>
      </div>
    </transition>

    <div class="home-page__content">
      <transition name="fade-out-in" 
                  mode="out-in">
        <div v-if="currentTab !== 'videos'" 
             :key="currentTab"
             class="home-page__media-list">
          {{ currentTab }}
        </div>
        <div v-else 
             :key="currentTab"
             class="home-page__media-list">
          <video-item v-for="video in videos" 
                      :key="video.path"
                      :video="video"
                      :selected="selectAll"
                      :selection-mode="selectionMode"
                      @video-item-selected="selectedItems.push(video)" 
                      @video-item-deselected="selectedItems.splice(selectedItems.findIndex(item => item._id === video._id), 1)"
                      @video-item-play="play(video)"/>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
const { dialog, getCurrentWindow } = require('electron').remote

import { mapGetters, mapActions } from 'vuex'

import IconButton from './Base/IconButton'
import IconToggleButton from './Base/IconToggleButton'
import FullscreenToggle from './Base/FullscreenToggle'
import NavBar from './HomePage/NavBar'
import AddMediaButton from './HomePage/AddMediaButton'
import VideoItem from './HomePage/VideoItem'
import SelectionMenu from './HomePage/SelectionMenu'

import '../assets/logo.svg'
import '../assets/icons/icon-settings.svg'
import '../assets/icons/icon-search.svg'
import '../assets/icons/icon-selection-mode.svg'
import '../assets/icons/icon-cancel.svg'
import '../assets/icons/icon-favorite.svg'
import '../assets/icons/icon-favorited.svg'
import '../assets/icons/icon-mark-watched.svg'
import '../assets/icons/icon-watched.svg'
import '../assets/icons/icon-delete.svg'
import '../assets/icons/icon-more.svg'

export default {
  name: 'HomePage',

  components: {
    IconButton,
    IconToggleButton,
    FullscreenToggle,
    NavBar,
    AddMediaButton,
    VideoItem,
    SelectionMenu,
  },

  data() {
    const queries = {
      recents: {
        $and: [
          { recentEpisodeId: { $exists: true } },
          { recentEpisodeId: { $ne: null } },
        ],
      },
      favorites: { favorite: true },
      movies: { mediaType: 'movie' },
      'tv shows': { mediaType: 'tvshow' },
      videos: { mediaType: { $in: ['folder', 'video'] } },
      private: { private: true },
    }

    return {
      navItems: Object.keys(queries),
      queries,
      fetched: [],
      currentTab: null,
      selectionMode: false,
      selectedItems: [],
      selectionMenu: false,
      selectAll: false,
    }
  },

  computed: {
    ...mapGetters(['videos']),
  },

  methods: {
    navItemChanged(item) {
      this.currentTab = item
      if (this.fetched.indexOf(item) > -1) return

      this.getMedia(this.queries[item]).then(() => this.fetched.push(item))
    },

    showAddMediaDialog() {
      dialog.showOpenDialog(
        getCurrentWindow(),
        {
          title: 'Pick A .mp4 File',
          buttonLabel: 'Add Media',
          filters: [{ name: 'Videos', extensions: ['mp4'] }],
          properties: ['openFile'],
        },
        paths => {
          if (paths) {
            this.$nextTick(() =>
              this.addMediaItem({ mediaType: 'video', filePath: paths[0] }),
            )
          }
        },
      )
    },

    showDeleteDialog() {
      if (!this.selectedItems.length) return

      dialog.showMessageBox(
        getCurrentWindow(),
        {
          type: 'warning',
          buttons: ['Delete', 'Cancel'],
          defaultId: 1,
          title: 'Delete Media',
          message: `This will delete ${this.selectedItems.length} media items.`,
          cancelId: 1,
        },
        response => {
          if (response === 0) {
            this.deleteMedia(this.selectedItems.map(({ _id }) => _id))
            this.selectedItems = []
          }
        },
      )
    },

    play(video) {
      this.switchCurrentPlayingEpisode(video)
      this.$router.push({ name: 'player' })
    },

    ...mapActions([
      'getMedia',
      'addMediaItem',
      'deleteMedia',
      'switchCurrentPlayingEpisode',
    ]),
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

  &__sidebar {
    grid-row: 1 / span 2;
    display: grid;
    grid-template-rows: 196px 64px+24px auto 48px+24px;
    grid-gap: 24px;
  }

  &__logo {
    width: 128px;
    height: 128px;
    @include theme-text-color-secondary();
    align-self: center;
    justify-self: center;
  }

  &__amd {
    justify-self: center;
  }

  &__nav {
    align-self: start;
  }

  &__settings {
    align-self: end;
    justify-self: end;
    margin-right: 16px;
  }

  &__toolbar,
  &__selection-toolbar {
    align-self: center;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 8px;
    justify-content: end;
  }

  &__selection-toolbar {
    border-radius: 8px;
    grid-template-columns: auto 1fr;
    align-items: center;
    @include theme-bg-color-primary-lighter();
    position: relative;
  }

  &__selection-mode-exit {
    justify-self: left;
  }

  &__selection-toolbar-title {
    margin-left: 16px;
    @include theme-typography-headline4();
    @include theme-text-color-on-primary-lighter();
  }

  &__selection-toolbar-menu {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
  }

  &__content {
    border-radius: 8px;
    border: 1px solid $theme-color-primary-lighter();
    @include theme-bg-color-primary-lighter();
    overflow: scroll;
  }

  &__media-list {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-gap: 24px;
    justify-content: center;
  }
}
</style>
