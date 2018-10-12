<template>
  <div class="subtitle-menu">
    <div v-if="video.subtitles && video.subtitles.length" 
         class="subtitle-menu__subtitles">
      <div v-for="subtitle in video.subtitles" 
           :key="subtitle._id" 
           class="subtitle-menu__subtitle"
           @click.stop="setDefaultSubtitleId(subtitle._id)">
        <svg v-visible="video.defaultSubtitleId === subtitle._id" 
             class="subtitle-menu__selected">
          <use xlink:href="#icon-checked"/>
        </svg>
        <div class="subtitle-menu__label">{{ subtitle.label }}</div>
        <icon-button icon="delete" 
                     theme="on-background"
                     class="subtitle-menu__delete"
                     @click.native.stop
                     @clicked="deleteSubtitle(subtitle._id)"/>
      </div>

      <div class="subtitle-menu__subtitle subtitle-menu__subtitle--none"
           @click.stop="setDefaultSubtitleId(null)">
        <svg v-visible="video.defaultSubtitleId === null" 
             class="subtitle-menu__selected">
          <use xlink:href="#icon-checked"/>
        </svg>
        <div class="subtitle-menu__label">None</div>
      </div>
    </div>

    <div v-else 
         class="subtitle-menu__empty">No Subtitles. Click "+" to add subtitles.</div>

    <icon-button icon="add"
                 theme="secondary"
                 class="subtitle-menu__add-button"
                 @click.native.stop
                 @clicked="showDialog"/>
  </div>
</template>

<script>
const { dialog, getCurrentWindow } = require('electron').remote

import { mapGetters, mapActions } from 'vuex'

import IconButton from '../Base/IconButton'

import '../../assets/icons/icon-checked.svg'
import '../../assets/icons/icon-add.svg'

export default {
  name: 'SubtitleMenu',

  components: { IconButton },

  computed: mapGetters({ video: 'currentEpisode' }),

  mounted() {
    this.dissmissHandler = e => {
      this.$emit('dismiss')
    }

    document.body.addEventListener('click', this.dissmissHandler)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.dissmissHandler)
  },

  methods: {
    showDialog() {
      dialog.showOpenDialog(
        getCurrentWindow(),
        {
          title: 'Add .srt or .vtt file',
          buttonLabel: 'Add Subtitle',
          filters: [{ name: 'subtitles', extensions: ['srt', 'vtt'] }],
          properties: ['openFile'],
        },
        paths => {
          if (paths) {
            this.$nextTick(() => {
              const oldSubtitleId = this.video.defaultSubtitleId
              const subtitle = {
                _id: Date.now().toString(),
                lang: 'en',
                label: 'English',
                filePath: paths[0],
              }

              this.addSubtitle(subtitle).then(() =>
                this.$emit('subtitle-changed', subtitle._id, oldSubtitleId),
            )
            })
          }
        },
      )
    },

    ...mapActions(['addSubtitle', 'setDefaultSubtitleId', 'deleteSubtitle']),
  },
}
</script>

<style lang="scss">
@import '../../theme';

.subtitle-menu {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  min-height: 96px;
  @include theme-text-color-on-background();
  @include theme-bg-color-background();
  display: grid;

  &__subtitles {
    margin-top: 8px;
    margin-bottom: 16px + 48px;
  }

  &__subtitle {
    height: 48px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-gap: 16px;
    align-items: center;
    @include theme-typography-subtitle1();
    cursor: pointer;
    will-change: background-color;
    transition: background-color 100ms
      $mdc-animation-sharp-curve-timing-function;

    &:hover {
      background-color: rgba(
        map-get($theme-text-color-map, 'on-background'),
        0.08
      );
    }

    &:focus {
      background-color: rgba(
        map-get($theme-text-color-map, 'on-background'),
        0.24
      );
    }

    &:active {
      background-color: rgba(
        map-get($theme-text-color-map, 'on-background'),
        0.32
      );
    }
  }

  &__selected {
    padding: 12px;
    width: 24px;
    height: 24px;
    @include theme-text-color-on-background();
  }

  &__delete {
    border-radius: 8px 0 0 8px;
    @include theme-text-color-on-background();
    opacity: 0;
    will-change: opacity;
    transition: 100ms $mdc-animation-standard-curve-timing-function;
  }

  &__subtitle:hover &__delete {
    opacity: 1;
  }

  &__empty {
    padding: 16px;
    @include theme-typography-body2();
  }

  &__add-button {
    position: absolute;
    left: 0;
    bottom: 0;
    border-radius: 0 8px 0 8px;
  }
}
</style>
