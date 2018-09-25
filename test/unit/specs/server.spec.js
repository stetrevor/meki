import createServer from '../../../src/main/server'

describe('file server', function() {
  it('createServer', function(done) {
    const server = createServer()

    server.listen(3000, () => {
      expect(server.address().port).to.equal(3000)
      done()
    })
  })
})
