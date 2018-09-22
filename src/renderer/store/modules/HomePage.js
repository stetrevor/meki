import path from 'path'

import api from '../../api'

const state = {
  media: [],
}

const getters = {
  videos(state) {
    return state.media.filter(
      mediaItem => mediaItem.mediaType === 'video' && !mediaItem.private,
    )
  },
}

const mutations = {
  ADD_MEDIA_ITEM(state, mediaItem) {
    state.media.push(mediaItem)
  },

  UPDATE_MEDIA_ITEM(state, mediaItem) {
    const index = state.media.findIndex(item => item._id === mediaItem._id)
    state.media.splice(index, 1, mediaItem)
  },

  UPDATE_MEDIA(state, items) {
    const ids = items.map(({ _id }) => _id)
    const media = items.filter(({ _id }) => !(_id in ids))
    state.media = media.concat(items)
  },

  DELETE_MEDIA_ITEMS(state, items) {
    const ids = items.map(({ _id }) => _id)
    state.media = items.filter(({ _id }) => !(_id in ids))
  },
}

const completeMediaData = mediaData => {
  let data, _id

  switch (mediaData.mediaType) {
    case 'video':
      // TODO: Faking it for now. Remove when database is implemented.
      _id = Date.now().toString()
      data = Object.assign({}, mediaData, {
        _id,
        title: path.basename(mediaData.filePath, '.mp4'),
      })
      break
    default:
      break
  }

  return data
}

const actions = {
  async addMediaItem({ dispatch, commit }, mediaData) {
    // api.addMediaItem will add basic info, and resolve.
    // api.getMediaItemMetadata will use actions.updateMediaItem to update
    // store state.
    const data = completeMediaData(mediaData)
    const mediaItem = await api.addMediaItem(data)
    commit('ADD_MEDIA_ITEM', mediaItem)

    api.getMediaItemMetadata(mediaItem.filePath, updates =>
      dispatch('updateMediaItem', updates),
    )
  },

  async updateMediaItem({ commit }, [id, updates]) {
    const mediaItem = await api.updateMedia([id], updates)
    commit('UPDATE_MEDIA_ITEM', mediaItem)
  },

  async updateMedia({ commit }, [ids, updates]) {
    const items = await api.updateMedia(ids, updates)
    commit('UPDATE_MEDIA', items)
  },

  async deleteMedia({ commit }, ids) {
    const deleted = await api.deleteMedia(ids)
    commit('DELETE_MEDIA_ITEMS', deleted)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
