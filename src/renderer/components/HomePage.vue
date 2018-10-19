<template>
  <div class="home-page">
    <div class="home-page__sidebar" 
         @click="exitSelectionMode">
      <svg class="home-page__logo"><use xlink:href="#logo"/></svg>

      <div class="home-page__add-media">
        <add-media-button class="home-page__amd" 
                          @click.native="AddMediaMenuShow = true" />
        <transition name="fade-out-in" 
                    mode="out-in">
          <add-media-menu v-if="AddMediaMenuShow" 
                          class="home-page__add-media-menu" 
                          @add-media-type="showAddMediaDialog($event)" 
                          @add-media-menu-dismiss="AddMediaMenuShow = false"/>
        </transition>
      </div>
      
      <nav-bar :nav-items="tabs" 
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
                     @click.native="exitSelectionMode"/>
        <div class="home-page__selection-toolbar-title">{{ selectedItemIds.length }} Selected</div>
        <icon-button :toggled="favoriteSet" 
                     :disabled="!selectedItemIds.length"
                     icon="favorited"
                     icon-toggled="favorite"
                     @clicked="updateMedia([selectedItemIds, { favorite: !favoriteSet }]); favoriteSet = !favoriteSet"/>

        <transition name="fade-out-in" 
                    mode="out-in">
          <icon-button :disabled="!selectedItemIds.length" 
                       icon="delete"
                       @clicked="showDeleteDialog"/>
        </transition>

        <icon-button icon="more" 
                     @clicked.stop="selectionMenu = true"/>

        <transition name="fade-out-in">
          <selection-menu v-if="selectionMenu" 
                          class="home-page__selection-toolbar-menu"
                          @select-all="selectedItemIds = videos.map(video => video._id)"
                          @select-none="selectedItemIds = []"
                          @dismiss="selectionMenu = false"/>
        </transition>
      </div>

      <div v-else 
           key="normal-mode" 
           class="home-page__toolbar">
        <icon-button icon="search"/>
        <icon-button icon="selection-mode" 
                     @clicked="selectionMode = true"/>
        <fullscreen-toggle/>
      </div>
    </transition>

    <div class="home-page__content">
      <section v-for="(items, category) in currentMedia" 
               v-if="items.length" 
               :key="category" 
               class="home-page__media-section">
        <div class="home-page__media-section-header">{{ category }}</div>
        
        <div class="home-page__media-section-list">
          <component v-for="item in items.sort(sortMediaByTitle)" 
                     :key="item._id" 
                     :is="mediaItemComponents[item.mediaType]" 
                     :media-item="item" 
                     :selected="selectedItemIds.includes(item._id)" 
                     :selection-mode="selectionMode"
                     @media-item-selected="selectedItemIds.push(item._id)" 
                     @media-item-deselected="selectedItemIds.splice(selectedItemIds.indexOf(item._id), 1)"
                     @media-item-open="open(item)"
                     @media-item-favorite="updateMedia([[item._id], { favorite: !item.favorite }])"
                     @media-item-show-in-folder="showItemInFolder(item)"
                     @media-item-mark-as-complete="updateMedia([[item._id], { progress: item.duration }])"/>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { shell, remote } from 'electron'

const { dialog, getCurrentWindow } = remote

import { mapState, mapGetters, mapActions } from 'vuex'

import IconButton from './Base/IconButton'
import FullscreenToggle from './Base/FullscreenToggle'
import NavBar from './HomePage/NavBar'
import AddMediaButton from './HomePage/AddMediaButton'
import VideoItem from './HomePage/VideoItem'
import FolderItem from './HomePage/FolderItem'
import SelectionMenu from './HomePage/SelectionMenu'
import AddMediaMenu from './HomePage/AddMediaMenu'

import '../assets/logo.svg'
import '../assets/icons/icon-settings.svg'
import '../assets/icons/icon-search.svg'
import '../assets/icons/icon-selection-mode.svg'
import '../assets/icons/icon-cancel.svg'
import '../assets/icons/icon-favorite.svg'
import '../assets/icons/icon-favorited.svg'
import '../assets/icons/icon-delete.svg'
import '../assets/icons/icon-more.svg'

export default {
  name: 'HomePage',

  components: {
    IconButton,
    FullscreenToggle,
    NavBar,
    AddMediaButton,
    VideoItem,
    FolderItem,
    SelectionMenu,
    AddMediaMenu,
  },

  data() {
    const mediaItemComponents = {
      movie: 'MovieItem',
      tvshow: 'TVShowItem',
      video: 'VideoItem',
      folder: 'FolderItem',
    }

    return {
      fetched: [],
      selectionMode: false,
      selectedItemIds: [],
      selectionMenu: false,
      selectAll: false,
      favoriteSet: false,
      AddMediaMenuShow: false,
      mediaItemComponents,
    }
  },

  computed: {
    ...mapState({
      tabs: state => state.HomePage.tabs,
      currentTab: state => state.HomePage.currentTab,
      queries: state => state.HomePage.queries,
    }),
    ...mapGetters(['currentMedia']),
  },

  methods: {
    navItemChanged(item) {
      this.switchTab(item)

      if (this.fetched.includes(item)) return

      this.getMedia(this.queries[item]).then(() => this.fetched.push(item))
    },

    showAddMediaDialog(mediaType) {
      const options = {
        folder: {
          title: 'Pick A Folder Containing .mp4 Files',
          buttonLabel: 'Add Folder',
          properties: ['openDirectory'],
        },
        video: {
          title: 'Pick A .mp4 File',
          buttonLabel: 'Add Video',
          filters: [{ name: 'Videos', extensions: ['mp4'] }],
          properties: ['openFile'],
        },
      }

      switch (mediaType) {
        case 'movie':
          break
        case 'tvshow':
          break
        case 'video':
        case 'folder':
          this.$nextTick().then(() => {
            dialog.showOpenDialog(
              getCurrentWindow(),
              options[mediaType],
              paths => {
                if (paths) {
                  this.$nextTick(() =>
                    this.addMediaItem({ mediaType, filePath: paths[0] }),
                  )
                }
              },
            )
          })
          break
        default:
          break
      }
    },

    showDeleteDialog() {
      if (!this.selectedItemIds.length) return

      dialog.showMessageBox(
        getCurrentWindow(),
        {
          type: 'warning',
          buttons: ['Delete', 'Cancel'],
          defaultId: 1,
          title: 'Delete Media',
          message: `This will delete ${
            this.selectedItemIds.length
          } media items.`,
          cancelId: 1,
        },
        response => {
          if (response === 0) {
            let imagePaths
            if ('videos' in this.currentMedia) {
              imagePaths = this.currentMedia['videos']
                .filter(video => this.selectedItemIds.includes(video._id))
                .map(video => video.thumbnailPath)
            }
            this.deleteMedia([this.selectedItemIds, imagePaths])

            this.selectedItemIds = []
          }
        },
      )
    },

    play(video) {
      this.switchCurrentEpisodeId(video._id)
      this.$router.push({ name: 'player' })
    },

    open(item) {
      switch (item.mediaType) {
        case 'video':
          this.play(item)
          break
        default:
          break
      }
    },

    sortMediaByTitle(v1, v2) {
      const [t1, t2] = [v1.title, v2.title]
      if (t1 == t2) return 0

      if (typeof t1 === typeof t2) {
        return t1 < t2 ? -1 : 1
      }

      return typeof a < typeof b ? -1 : 1
    },

    exitSelectionMode() {
      this.selectionMode = false
      this.selectedItemIds = []
      this.favoriteSet = false
    },

    showItemInFolder(item) {
      shell.showItemInFolder(item.filePath)
    },

    ...mapActions([
      'getMedia',
      'addMediaItem',
      'updateMedia',
      'deleteMedia',
      'switchCurrentEpisodeId',
      'switchTab',
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

  &__add-media {
    position: relative;
    justify-self: center;
  }

  &__add-media-menu {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
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

  &__media-section {
    padding: 24px;
  }

  &__media-section-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-gap: 24px;
  }

  &__media-section-header {
    @include theme-typography-headline3();
    @include theme-text-color-on-primary-lighter();
    text-transform: capitalize;
    margin-bottom: 16px;
  }
}
</style>
