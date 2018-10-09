import { remote } from 'electron'

const settings = remote.require('electron-settings')

const state = {
  volume: 100,
  muted: false,
  currentEpisode: null,
}

const mutations = {
  UPDATE_VOLUME(state, volume) {
    state.volume = volume
  },

  UPDATE_MUTED(state, muted) {
    state.muted = muted
  },

  SWITCH_CURRENT_EPISODE(state, episode) {
    state.currentEpisode = episode
  },
}

const actions = {
  setSoundVolume({ commit }, volume) {
    settings.set('videoPlayer.volume', volume)
    commit('UPDATE_VOLUME', volume)
  },

  setSoundMuted({ commit }, muted) {
    settings.set('videoPlayer.muted', muted)
    commit('UPDATE_MUTED', muted)
  },

  switchCurrentEpisode({ commit }, episode) {
    commit('SWITCH_CURRENT_EPISODE', episode)
  },
}

export default { state, mutations, actions }
