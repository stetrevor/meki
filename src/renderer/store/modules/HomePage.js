import path from 'path'

import api from '../../api'

const state = {
  media: [],
}

const getters = {
  videos(state) {
    return state.media.filter(
      mediaItem =>
        ['folder', 'video'].indexOf(mediaItem.mediaType) > -1 &&
        !mediaItem.private,
    )
  },
}

const mutations = {
  RECEIVE_MEDIA(state, items) {
    state.media = state.media.concat(items)
  },

  ADD_MEDIA_ITEM(state, mediaItem) {
    state.media.push(mediaItem)
  },

  UPDATE_MEDIA(state, items) {
    const ids = items.map(({ _id }) => _id)
    const unchanged = state.media.filter(({ _id }) => ids.indexOf(_id) < 0)
    state.media = unchanged.concat(items)
  },

  DELETE_MEDIA(state, items) {
    const ids = items.map(({ _id }) => _id)
    state.media = items.filter(({ _id }) => ids.indexOf(_id) < 0)
  },
}

const completeMediaData = mediaData => {
  let data

  switch (mediaData.mediaType) {
    case 'video':
      data = Object.assign({}, mediaData, {
        title: path.basename(mediaData.filePath, '.mp4'),
      })
      break
    default:
      break
  }

  return data
}

const actions = {
  async getMedia({ commit }, query) {
    const media = await api.getMedia(query)
    commit('RECEIVE_MEDIA', media)
  },

  async addMediaItem({ dispatch, commit }, mediaData) {
    const data = completeMediaData(mediaData)
    const mediaItem = await api.addMediaItem(data)
    commit('ADD_MEDIA_ITEM', mediaItem)

    const { _id, filePath } = mediaItem
    api.getVideoInfo({ _id, filePath }, updates => {
      dispatch('updateMedia', [[updates._id], updates])
    })
  },

  async updateMedia({ commit }, [ids, updates]) {
    const items = await api.updateMedia(ids, updates)
    commit('UPDATE_MEDIA', items)
  },

  async deleteMedia({ commit }, ids) {
    const [deleted, _] = await api.deleteMedia(ids)
    commit('DELETE_MEDIA', deleted)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
