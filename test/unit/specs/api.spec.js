import api from '../../../src/renderer/api'
import db from '../../../src/renderer/db'

describe('api', function() {
  describe('media', function() {
    beforeEach(function(done) {
      db.media.remove({}, { multi: true }, done)
    })

    it('getMedia', function() {
      return Promise.all([
        api.addMediaItem({ _id: '1', filePath: 'abc.mp4', mediaType: 'video' }),
        api.addMediaItem({
          _id: '2',
          filePath: 'abc.mp4',
          mediaType: 'folder',
        }),
      ]).then(() => {
        return api
          .getMedia({ mediaType: { $in: ['folder', 'video'] } })
          .then(items => {
            expect(items).to.deep.equal([
              {
                _id: '1',
                filePath: 'abc.mp4',
                mediaType: 'video',
              },
              {
                _id: '2',
                filePath: 'abc.mp4',
                mediaType: 'folder',
              },
            ])
          })
      })
    })

    it('addMediaItem', function() {
      return api
        .addMediaItem({ _id: '1', filePath: 'abc.mp4' })
        .then(mediaItem =>
          expect(mediaItem).to.deep.equal({ _id: '1', filePath: 'abc.mp4' }),
        )
    })

    it('updateMedia', function() {
      return api.addMediaItem({ _id: '1', filePath: 'abc.mp4' }).then(() => {
        return api.updateMedia(['1'], { favorite: true }).then(mediaItem => {
          expect(mediaItem).to.deep.equal([
            {
              _id: '1',
              favorite: true,
              filePath: 'abc.mp4',
            },
          ])
        })
      })
    })

    it('deleteMedia', function() {
      return api.addMediaItem({ _id: '1', filePath: 'abc.mp4' }).then(() => {
        return api.deleteMedia(['1']).then(([ids, numRemoved]) => {
          expect(ids).to.deep.equal(['1'])
          expect(numRemoved).to.equal(1)
        })
      })
    })
  })
})
