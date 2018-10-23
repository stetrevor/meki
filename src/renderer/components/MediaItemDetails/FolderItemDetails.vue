.<template>
  <div class="folder-item-details">
    <div class="folder-item-details__container">
      <div class="folder-item-details__header">
        <icon-button icon="back" 
                     @clicked="$router.go(-1)"/>

        <div class="folder-item-details__title">{{ mediaItem.title }}</div>
      
        <icon-button class="folder-item-details__header-action" 
                     icon="folder"
                     @clicked="$emit('folder-item-show-in-folder')"/>
        <icon-button :toggled="mediaItem.favorite"
                     class="folder-item-details__header-action"
                     icon="favorite"
                     icon-toggled="favorited" 
                     @clicked="$emit('folder-item-favorite')"/>
      </div>
      
      <div class="folder-item-details__content">
        <episode-item v-for="episode in fileListWithEpisodeInfo" 
                      :episode="episode"
                      :key="episode.name"
                      @click.native="open(episode)"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { PathFuncMixin } from '../../mixins'

import IconButton from '../Base/IconButton'
import EpisodeItem from './EpisodeItem'

export default {
  name: 'FolderItemDetails',

  components: { IconButton, EpisodeItem },

  mixins: [PathFuncMixin],

  props: {
    mediaItem: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      currentDir: this.mediaItem.filePath,
    }
  },

  computed: {
    fileListWithEpisodeInfo() {
      return this.fileList
        .filter(entry => !entry.name.startsWith('.'))
        .map(entry => {
          const isDir = entry.isDirectory()
          const title = entry.name
          const info = this.episodes.find(episode =>
            this.isSamePath(episode.filePath, this.currentDir, entry.name),
          )
          return { isDir, title, info }
        })
    },

    ...mapGetters(['episodes', 'fileList']),
  },

  created() {
    this.getEpisodes(this.mediaItem._id)
    if (this.mediaItem.mediaType === 'folder') {
      this.getFileList(this.mediaItem.filePath)
    }
  },

  methods: {
    open(episode) {
      if (episode.isDir) {
        this.currentDir = this.pathJoin(this.currentDir, episode.title)
        this.getFileList(this.currentDir)
      } else {
        // Open Media Player
      }
    },

    ...mapActions(['getEpisodes', 'getFileList']),
  },
}
</script>

<style lang="scss">
@import '../../theme';

.folder-item-details {
  width: 100vw;
  height: 100vh;
  @include theme-bg-color-primary();

  &__container {
    margin: auto;
    min-width: 960px;
    max-width: 33vw;
    height: 100vh;
    display: grid;
    grid-template-rows: 96px 1fr;
    grid-auto-flow: row;
    @include theme-bg-color-primary-lighter();
  }

  &__header {
    grid-row: 1 / 2;
    padding: 0 16px;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    grid-gap: 8px;
    align-items: center;
    border-bottom: 1px solid
      rgba(map-get($theme-text-color-map, 'on-primary-lighter'), 0.32);
  }

  &__title {
    max-height: 1.5em;
    padding: 8px;
    @include theme-typography-headline3();
    @include theme-text-color-on-primary();
    overflow: scroll;
  }

  &__content {
    grid-row: 2 / 3;
    padding: 8px 0;
    overflow: scroll;
  }
}
</style>
