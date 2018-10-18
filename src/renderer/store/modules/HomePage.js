import path from 'path'

import api from '../../api'

const state = {
  media: [],
  tabs: ['recents', 'favorites', 'movies', 'tv shows', 'videos', 'private'],
  currentTab: null,
}

const getters = {
  videos(state) {
    return state.media.filter(
      mediaItem =>
        ['folder', 'video'].includes(mediaItem.mediaType) && !mediaItem.private,
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
    const unchanged = state.media.filter(({ _id }) => !ids.includes(_id))
    state.media = unchanged.concat(items)
  },

  DELETE_MEDIA(state, ids) {
    state.media = state.media.filter(({ _id }) => !ids.includes(_id))
  },

  SWITCH_TAB(state, tabName) {
    state.currentTab = tabName
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

  async updateMediaArrayField({ commit }, [id, updates]) {
    const items = await api.updateMediaArrayField(id, updates)
    commit('UPDATE_MEDIA', items)
  },

  async deleteMedia({ commit }, [ids, imagePaths]) {
    const [deletedIds, _] = await api.deleteMedia(ids, imagePaths)
    commit('DELETE_MEDIA', deletedIds)
  },

  switchTab({ commit }, tabName) {
    commit('SWITCH_TAB', tabName)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
