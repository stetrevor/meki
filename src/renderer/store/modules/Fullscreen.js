import { remote } from 'electron'

const win = remote.getCurrentWindow()

const state = {
  fullscreen: win.isFullScreen(),
}

const getters = {
  fullscreen(state) {
    return state.fullscreen
  },
}

const mutations = {
  SET_FULLSCREEN(state, fullscreen) {
    state.fullscreen = fullscreen
  },
}

const actions = {
  toggleFullscreen({ commit }) {
    win.setFullScreen(!win.isFullScreen())
    commit('SET_FULLSCREEN', win.isFullScreen())
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
