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
  ADD_MEDIA_ITEM(state, mediaItem) {
    const m = Object.assign({}, mediaItem, {
      title: path.basename(mediaItem.path, '.mp4'),
      _id: Date.now(),
    })
    state.media.push(m)
  },

  DELETE_MEDIA_ITEMS(state, items) {
    items.forEach(item => {
      const index = state.media.findIndex(m => m._id === item._id)
      state.media.splice(index, 1)
    })
  },
}

const actions = {
  addMediaItem({ commit }, mediaItem) {
    commit('ADD_MEDIA_ITEM', mediaItem)
  },

  deleteMedia({ commit }, items) {
    commit('DELETE_MEDIA_ITEMS', items)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
