export default {
  async addMediaItem(data) {
    console.warn('api.addMediaItem NOT Implemented')
    return data
  },

  getMediaItemMetadata(filePath, callback) {
    console.warn('api.getMediaItemMetadata NOT Implemented')
  },

  async deleteMedia(ids) {
    const deleted = ids.reduce((acc, curr) => {
      acc.push({ _id: curr })
      return acc
    }, [])
    console.warn('api.deleteMedia NOT Imlemented', deleted)

    return deleted
  },
}
