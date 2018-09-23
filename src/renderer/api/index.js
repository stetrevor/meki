import { ipcRenderer } from 'electron'

let setupVideoInfo = false

export default {
  async addMediaItem(data) {
    console.warn('api.addMediaItem NOT Implemented')
    return data
  },

  getVideoInfo(videoData, callback) {
    ipcRenderer.send('video-info-request', videoData)
    if (!setupVideoInfo) {
      ipcRenderer.on('video-info-response', (_, info) => callback(info))
      setupVideoInfo = true
    }
  },

  async updateMedia(ids, updates) {
    console.warn('api.addMediaItem NOT Implemented')
    return await updates
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
