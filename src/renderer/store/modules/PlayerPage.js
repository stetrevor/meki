const state = {
  volume: 100,
  muted: false,
}

const mutations = {
  UPDATE_VOLUME(state, volume) {
    state.volume = volume
  },

  UPDATE_MUTED(state, muted) {
    state.muted = muted
  },
}

const actions = {
  setSoundVolume({ commit }, volume) {
    commit('UPDATE_VOLUME', volume)
  },

  setSoundMuted({ commit }, muted) {
    commit('UPDATE_MUTED', muted)
  },
}

export default { state, mutations, actions }
