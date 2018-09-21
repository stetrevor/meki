describe('ffmpeg-static', () => {
  it('should have the path to ffmpeg', () => {
    const { path } = require('ffmpeg-static')

    expect(path).to.contain('ffmpeg')
  })
})
