const state = {
  currentMediaItem: null,
}

const mutations = {
  SWITCH_CURRENT_MEDIA_ITEM(state, mediaItem) {
    state.currentMediaItem = mediaItem
  },
}

const actions = {
  switchCurrentMediaItem({ commit }, mediaItem) {
    commit('SWITCH_CURRENT_MEDIA_ITEM', mediaItem)
  },
}

export default { state, mutations, actions }
