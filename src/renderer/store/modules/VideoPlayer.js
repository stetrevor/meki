import { remote } from 'electron'

const settings = remote.require('electron-settings')

const state = {
  volume: 100,
  muted: false,
  currentPlayingEpisode: null,
}

const mutations = {
  UPDATE_VOLUME(state, volume) {
    state.volume = volume
  },

  UPDATE_MUTED(state, muted) {
    state.muted = muted
  },

  SWITCH_CURRENT_PLAYING_EPISODE(state, episode) {
    state.currentPlayingEpisode = episode
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

  switchCurrentPlayingEpisode({ commit }, episode) {
    commit('SWITCH_CURRENT_PLAYING_EPISODE', episode)
  },
}

export default { state, mutations, actions }
