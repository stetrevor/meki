describe('db', function() {
  describe('nedb', function() {
    it('should have a dev directory under source tree', function() {
      const { media } = require('../../../src/renderer/db').default
      const Datastore = require('nedb')

      expect(media).to.be.instanceOf(Datastore)
    })
  })
})
