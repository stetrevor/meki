import path from 'path'

const state = {
  media: [],
}

const getters = {
  videos(state) {
    return state.media.filter(mediaItem => mediaItem.type === 'video')
  },
}

const mutations = {
  ADD_MEDIA(state, mediaItem) {
    const m = Object.assign({}, mediaItem, {
      title: path.basename(mediaItem.path, '.mp4'),
    })
    state.media.push(m)
  },
}

const actions = {
  addMedia({ commit }, mediaItem) {
    // do something async
    commit('ADD_MEDIA', mediaItem)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
