import { remote } from 'electron'

const settings = remote.require('electron-settings')

const state = {
  volume: 100,
  muted: false,
  currentEpisodeId: null,
}

const getters = {
  currentEpisode(state, _, rootState) {
    return rootState.HomePage.media.find(
      media => media._id === state.currentEpisodeId,
    )
  },
}

const mutations = {
  UPDATE_VOLUME(state, volume) {
    state.volume = volume
  },

  UPDATE_MUTED(state, muted) {
    state.muted = muted
  },

  SWITCH_CURRENT_EPISODE_ID(state, episodeId) {
    state.currentEpisodeId = episodeId
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

  switchCurrentEpisodeId({ commit }, episodeId) {
    commit('SWITCH_CURRENT_EPISODE_ID', episodeId)
  },

  async setDefaultSubtitleId({ state, dispatch }, defaultSubtitleId) {
    await dispatch('updateMedia', [
      [state.currentEpisodeId],
      { defaultSubtitleId },
    ])
  },

  async addSubtitle({ state, dispatch }, subtitle) {
    const { _id } = subtitle

    await dispatch('updateMediaArrayField', [
      state.currentEpisodeId,
      { $push: { subtitles: subtitle } },
    ])

    // Refactor: Use setDefaultSubtitleId instead.
    await dispatch('updateMedia', [
      [state.currentEpisodeId],
      { defaultSubtitleId: _id },
    ])
  },

  async deleteSubtitle({ state, getters, dispatch }, subtitleId) {
    await dispatch('updateMediaArrayField', [
      state.currentEpisodeId,
      { $pull: { subtitles: { _id: subtitleId } } },
    ])

    if (subtitleId === getters.currentEpisode.defaultSubtitleId) {
      const subtitles = getters.currentEpisode.subtitles
      const subtitleId = subtitles.length
        ? subtitles[subtitles.length - 1]._id
        : null
      await dispatch('setDefaultSubtitleId', subtitleId)
    }
  },
}

export default { state, getters, mutations, actions }
