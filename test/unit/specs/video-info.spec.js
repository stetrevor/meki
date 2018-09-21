import path from 'path'
import fs from 'fs'

import ffmpeg from 'fluent-ffmpeg'
import ffmpegBin from 'ffmpeg-static'
import ffprobeBin from 'ffprobe-static'
import hash from 'hash.js'

import getVideoInfo from '../../../src/main/video-info'

describe('ffmpeg-static', () => {
  it('should have the path to ffmpeg', () => {
    console.log('ffmpeg-static', ffmpegBin.path)
    expect(ffmpegBin.path).to.contain('ffmpeg')
  })
})

describe('ffprobe-static', () => {
  it('should have the path to ffprobe', () => {
    console.log('ffprobe-static', ffprobeBin.path)
    expect(ffprobeBin.path).to.contain('ffprobe')
  })
})

describe('fluent-ffmpeg', () => {
  before(() => {
    ffmpeg.setFfmpegPath(ffmpegBin.path)
    ffmpeg.setFfprobePath(ffprobeBin.path)
  })

  it('should have ffmpeg', () => {
    expect(ffmpeg).to.exist
  })

  it('should return duration by ffprobe', done => {
    ffmpeg(path.join(__dirname, 'test.mp4')).ffprobe((err, data) => {
      console.log('duration', data.format.duration)

      expect(data).to.exist
      done()
    })
  })

  it('should generate thumbnail', done => {
    ffmpeg(path.join(__dirname, 'test.mp4'))
      .on('codecData', data => {
        console.log('codecData duration', data.duration)
      })
      .on('end', () => {
        fs.exists(path.join(__dirname, 'temp', 'tn.png'), exists => {
          expect(exists).to.be.true
          done()
        })
      })
      .takeScreenshots({
        count: 1,
        timestamps: ['30%'],
        folder: path.join(__dirname, 'temp'),
      })
  })
})

describe('hash.js', () => {
  it('should create hash from path string with digest', () => {
    const h = hash
      .sha256()
      .update(__dirname)
      .digest('hex')
    console.log('hash', h)
    expect(h).to.equal(
      'c1d4a3e54572a166c28fc47af29d33b7ca5f2e0aa6b1b040609e279a31e0ea7e',
    )
    expect(h).to.have.lengthOf(64)
  })
})

describe('video-info', function() {
  it('should get video info: runtime and thumbnail', function() {
    return getVideoInfo(
      path.join(__dirname, 'test.mp4'),
      path.join(__dirname, 'temp'),
    ).then(info => {
      const h =
        hash
          .sha256()
          .update(path.join(__dirname, 'test.mp4'))
          .digest('hex') + '.png'

      expect(info).to.deep.equal({
        runtime: 10.022,
        backdropPath: h,
      })
    })
  })
})
