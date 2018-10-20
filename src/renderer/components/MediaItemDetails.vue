<template>
  <component :is="detailsComponents[mediaItem.mediaType]" 
             :media-item="mediaItem"/>
</template>

<script>
import FolderItemDetails from './MediaItemDetails/FolderItemDetails'

export default {
  name: 'MediaItemDetails',

  components: { FolderItemDetails },

  // props: {
  //   mediaItem: {
  //     type: Object,
  //     required: true,
  //   },
  // },

  data() {
    return {
      detailsComponents: {
        folder: FolderItemDetails,
      },

      mediaItem: {
        title: 'Folder Item Title A Bit Long',
        favorite: true,
        mediaType: 'folder',
      },
    }
  },
}
</script>
