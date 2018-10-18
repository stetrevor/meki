import path from 'path'

import api from '../../api'

const state = {
  media: [],
  tabs: ['recents', 'favorites', 'movies', 'tv shows', 'videos', 'private'],
  currentTab: null,
}

const getters = {
  movies(state) {
    return state.media.filter(
      mediaItem => mediaItem.mediaType === 'movie' && !mediaItem.private,
    )
  },

  tvshows(state) {
    return state.media.filter(
      mediaItem => mediaItem.mediaType === 'tvshow' && !mediaItem.private,
    )
  },

  folders(state) {
    return state.media.filter(
      mediaItem => mediaItem.mediaType === 'folder' && !mediaItem.private,
    )
  },

  videos(state) {
    return state.media.filter(
      mediaItem => mediaItem.mediaType === 'video' && !mediaItem.private,
    )
  },

  currentMedia(state, getters) {
    switch (state.currentTab) {
      case 'recents':
        return {
          movies: getters.movies.filter(item => item.recentEpisodeId),
          'tv shows': getters.tvshows.filter(item => item.recentEpisodeId),
          folders: getters.folders.filter(item => item.recentEpisodeId),
          videos: getters.videos.filter(item => item.recentEpisodeId),
        }
      case 'favorites':
        return {
          movies: getters.movies.filter(item => item.favorite),
          'tv shows': getters.tvshows.filter(item => item.favorite),
          folders: getters.folders.filter(item => item.favorite),
          videos: getters.videos.filter(item => item.favorite),
        }
      case 'movies':
        return { movies: getters.movies }
      case 'tv shows':
        return { 'tv shows': getters.tvshows }
      case 'videos':
        return { folders: getters.folders, videos: getters.videos }
      case 'private':
        break
      default:
        return []
    }
  },
}

const mutations = {
  ADD_MEDIA_ITEM(state, mediaItem) {
    state.media.push(mediaItem)
  },

  UPDATE_MEDIA(state, items) {
    const ids = items.map(({ _id }) => _id)
    const unchanged = state.media.filter(({ _id }) => !ids.includes(_id))
    state.media = unchanged.concat(items)
  },

  DELETE_MEDIA(state, ids) {
    state.media = state.media.filter(({ _id }) => !ids.includes(_id))
  },

  SWITCH_TAB(state, tabName) {
    state.currentTab = tabName
  },
}

const completeMediaData = mediaData => {
  switch (mediaData.mediaType) {
    case 'folder':
      return Object.assign({}, mediaData, {
        title: path.basename(mediaData.filePath),
      })
    case 'video':
      return Object.assign({}, mediaData, {
        title: path.basename(mediaData.filePath, '.mp4'),
      })
    default:
      return mediaData
  }
}

const actions = {
  async getMedia({ commit }, query) {
    const media = await api.getMedia(query)
    commit('UPDATE_MEDIA', media)
  },

  async addMediaItem({ dispatch, commit }, mediaData) {
    const data = completeMediaData(mediaData)
    const mediaItem = await api.addMediaItem(data)
    commit('ADD_MEDIA_ITEM', mediaItem)

    if (mediaData.mediaType === 'video') {
      const { _id, filePath } = mediaItem
      api.getVideoInfo({ _id, filePath }, updates => {
        dispatch('updateMedia', [[updates._id], updates])
      })
    }
  },

  async updateMedia({ commit }, [ids, updates]) {
    const items = await api.updateMedia(ids, updates)
    commit('UPDATE_MEDIA', items)
  },

  async updateMediaArrayField({ commit }, [id, updates]) {
    const items = await api.updateMediaArrayField(id, updates)
    commit('UPDATE_MEDIA', items)
  },

  async deleteMedia({ commit }, [ids, imagePaths]) {
    const [deletedIds, _] = await api.deleteMedia(ids, imagePaths)
    commit('DELETE_MEDIA', deletedIds)
  },

  switchTab({ commit }, tabName) {
    commit('SWITCH_TAB', tabName)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
