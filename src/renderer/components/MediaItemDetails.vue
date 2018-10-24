<template>
  <component :is="detailsComponents[mediaItem.mediaType]" 
             :media-item="mediaItem"/>
</template>

<script>
import { mapState } from 'vuex'

import FolderItemDetails from './MediaItemDetails/FolderItemDetails'

export default {
  name: 'MediaItemDetails',

  components: { FolderItemDetails },

  data() {
    return {
      detailsComponents: {
        folder: FolderItemDetails,
      },
    }
  },

  computed: mapState({
    mediaItem: state => state.MediaItemDetails.currentMediaItem,
  }),
}
</script>
