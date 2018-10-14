import path from 'path'
import fs from 'fs'

import ffmpeg from 'fluent-ffmpeg'
import ffmpegBin from 'ffmpeg-static'
import ffprobeBin from 'ffprobe-static'
import hash from 'hash.js'
import { Subject } from 'rxjs'

import { getVideoInfo, setup } from '../../../src/main/video-info'

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

describe('rxjs', function() {
  describe('Subject', function() {
    it('can have next called outside', function() {
      const s = new Subject()
      let value

      s.subscribe(v => (value = v))

      s.next('a')
      expect(value).to.equal('a')
      s.next('b')
      expect(value).to.equal('b')
      s.next('c')
      expect(value).to.equal('c')
    })
  })
})

describe('video-info', function() {
  it('should get video info: runtime and thumbnail', function() {
    const videData = { _id: '1234', filePath: path.join(__dirname, 'test.mp4') }
    return getVideoInfo(videData, path.join(__dirname, 'temp')).then(info => {
      const h =
        hash
          .sha256()
          .update(path.join(__dirname, 'test.mp4'))
          .digest('hex') + '.png'

      expect(info).to.deep.equal(
        Object.assign({}, videData, {
          runtime: 10.022,
          thumbnailPath: h,
        }),
      )
    })
  })

  it('should accept input function and output function', function(done) {
    const paths = [1, 2, 3].map(i =>
      path.join(__dirname, 'fixture-videos', `test${i}.mp4`),
    )
    console.log('paths', paths)
    const hashs = [
      '352a61d787a42093e2a5ade9b45a8e0d02b7e494ede001f1a95f2d25e56d0d59.png',
      '1be0f87b04526ec0451ee62a2bc0f22ccd9f3527d24c6a53b9772b0eb5b31842.png',
      '8b830981104bd1736c1e156e72a124afa8fedd5ebb88f6da3a3267c03231f6e8.png',
    ]
    console.log('hashs', hashs)
    const fixture = paths.map((filePath, i) => ({ _id: i + 1, filePath }))
    let expected = fixture.map((d, i) =>
      Object.assign({}, d, {
        runtime: 1.022,
        thumbnailPath: hashs[i],
      }),
    )

    setup(
      path.join(__dirname, 'temp'),
      videoData$ => {
        fixture.forEach(d => videoData$.next(d))
        videoData$.complete()
      },
      info => {
        const ex = expected.find(r => r._id === info._id)
        expect(info).to.deep.equal(ex)
        expected = expected.filter(r => r._id !== info._id)
      },
      null,
      done,
    )
  })
})
