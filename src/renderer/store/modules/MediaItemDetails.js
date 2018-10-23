import api from '../../api'
import { alphanumSort } from '../utils'

const state = {
  currentMediaItem: null,
  episodes: [],
  fileList: [],
}

const getters = {
  episodes(state) {
    return state.episodes
  },

  fileList(state) {
    return state.fileList
  },
}

const mutations = {
  SWITCH_CURRENT_MEDIA_ITEM(state, mediaItem) {
    state.currentMediaItem = mediaItem
  },

  RECEIVE_EPISODES(state, episodes) {
    state.episodes = state.episodes.concat(episodes)
  },

  RECEIVE_FILE_LIST(state, fileList) {
    state.fileList = fileList
  },
}

const actions = {
  switchCurrentMediaItem({ commit }, mediaItem) {
    commit('SWITCH_CURRENT_MEDIA_ITEM', mediaItem)
  },

  async getEpisodes({ commit }, mediaItemId) {
    const episodes = await api.getEpisodes(mediaItemId)
    commit('RECEIVE_EPISODES', episodes)
  },

  async getFileList({ commit }, dir) {
    const fileList = await api.getFileList(dir)

    const dirs = fileList.filter(entry => entry.isDirectory())
    const files = fileList.filter(entry => !entry.isDirectory())

    const sorted = dirs.sort(alphanumSort).concat(files.sort(alphanumSort))
    commit('RECEIVE_FILE_LIST', sorted)
  },
}

export default { state, getters, mutations, actions }
