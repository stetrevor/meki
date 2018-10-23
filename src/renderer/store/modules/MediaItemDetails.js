import api from '../../api'

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
    commit('RECEIVE_FILE_LIST', fileList)
  },
}

export default { state, getters, mutations, actions }
