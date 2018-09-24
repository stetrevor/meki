import HomePage from '../../../src/renderer/store/modules/HomePage'

describe('store', function() {
  describe('HomePage', function() {
    describe('getters', function() {
      it('videos', function() {
        const state = {
          media: [
            { _id: '1', mediaType: 'video' },
            { _id: '2', mediaType: 'folder', private: false },
            { _id: '3', mediaType: 'video', private: false },
            { _id: '4', mediaType: 'tvshow' },
            { _id: '5', mediaType: 'video', private: true },
          ],
        }
        expect(HomePage.getters.videos(state)).to.deep.equal([
          { _id: '1', mediaType: 'video' },
          { _id: '2', mediaType: 'folder', private: false },
          { _id: '3', mediaType: 'video', private: false },
        ])
      })
    })

    describe('mutations', function() {
      it('RECEIVE_MEDIA', function() {
        const state = { media: [] }

        HomePage.mutations.RECEIVE_MEDIA(state, [
          { _id: '1', mediaType: 'video' },
        ])
        expect(state.media).to.deep.equal([{ _id: '1', mediaType: 'video' }])
      })

      it('ADD_MEDIA_ITEM', function() {
        const state = { media: [{ _id: '1', mediaType: 'video' }] }

        HomePage.mutations.ADD_MEDIA_ITEM(state, {
          _id: '2',
          mediaType: 'folder',
        })
        expect(state.media).to.deep.equal([
          { _id: '1', mediaType: 'video' },
          { _id: '2', mediaType: 'folder' },
        ])
      })

      it('UPDATE_MEDIA', function() {
        const state = {
          media: [
            { _id: '1', mediaType: 'video' },
            { _id: '2', mediaType: 'folder' },
          ],
        }

        HomePage.mutations.UPDATE_MEDIA(state, [
          {
            _id: '2',
            mediaType: 'folder',
            favorite: true,
          },
        ])
        expect(state.media).to.deep.equal([
          { _id: '1', mediaType: 'video' },
          { _id: '2', mediaType: 'folder', favorite: true },
        ])
      })

      it('DELETE_MEDIA', function() {
        const state = {
          media: [
            { _id: '1', mediaType: 'video' },
            { _id: '2', mediaType: 'folder' },
          ],
        }

        HomePage.mutations.DELETE_MEDIA(state, ['2'])
        expect(state.media).to.deep.equal([{ _id: '1', mediaType: 'video' }])
      })
    })
  })
})
