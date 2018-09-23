import { ipcRenderer } from 'electron'

import { promisify } from 'util'

import db from '../db'

let setupVideoInfo = false

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
  insert: promisify((...params) => db.media.insert(...params)),
  update: promisifyUpdate(db.media),
  deleteMedia: promisify((...params) => db.media.remove(...params)),
}

export default {
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

  async deleteMedia(ids) {
    const numRemoved = await media.deleteMedia(
      { _id: { $in: ids } },
      { multi: true },
    )
    return [ids, numRemoved]
  },
}
