import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

const state = {
  currentPlayingEpisode: null,
}

const mutations = {
  SWITCH_CURRENT_PLAYING_EPISODE(state, episode) {
    state.currentPlayingEpisode = episode
  },
}

const actions = {
  switchCurrentPlayingEpisode({ commit }, episode) {
    commit('SWITCH_CURRENT_PLAYING_EPISODE', episode)
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
  strict: process.env.NODE_ENV !== 'production',
})
