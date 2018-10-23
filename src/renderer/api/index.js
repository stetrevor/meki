import { ipcRenderer } from 'electron'

import { promisify } from 'util'

import db from '../db'
import readdir from 'fs-readdir-with-file-types'

let setupVideoInfo = false
let setupDeleteImageFile = false

function promisifyUpdate(dbCollection) {
  return (...params) => {
    return new Promise((resolve, reject) => {
      dbCollection.update(
        ...params,
        { returnUpdatedDocs: true, multi: true },
        (err, _, affectedDocs, __) => {
          if (err) reject(err)

          resolve(affectedDocs)
        },
      )
    })
  }
}

const media = {
  find: promisify((...params) => db.media.find(...params)),
  insert: promisify((...params) => db.media.insert(...params)),
  update: promisifyUpdate(db.media),
  delete: promisify((...params) => db.media.remove(...params)),
}

export default {
  async getMedia(query) {
    return await media.find(query)
  },

  async addMediaItem(data) {
    return await media.insert(data)
  },

  getVideoInfo(videoData, callback) {
    ipcRenderer.send('video-info-request', videoData)
    if (!setupVideoInfo) {
      ipcRenderer.on('video-info-response', (_, info) => callback(info))
      setupVideoInfo = true
    }
  },

  async updateMedia(ids, updates) {
    return await media.update({ _id: { $in: ids } }, { $set: updates })
  },

  async updateMediaArrayField(_id, updates) {
    return await media.update({ _id }, updates)
  },

  async deleteMedia(ids, imagePaths = []) {
    const numRemoved = await media.delete(
      { _id: { $in: ids } },
      { multi: true },
    )

    imagePaths.forEach(imagePath =>
      ipcRenderer.send('delete-image-file-request', imagePath),
    )

    if (setupDeleteImageFile) {
      ipcRenderer.on('delete-image-file-response', (_, success, filePath) => {
        if (!success) throw new Error(`${filePath} can't be deleted!`)
      })

      setupDeleteImageFile = true
    }

    return [ids, numRemoved]
  },

  async getEpisodes(mediaItemId) {
    return await media.find({ mediaItemId })
  },

  async addEpisode(episode) {
    return await media.insert(episode)
  },

  async getFileList(dir) {
    return await readdir(dir)
  },
}
