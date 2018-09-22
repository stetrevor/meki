import ffmpeg from 'fluent-ffmpeg'
import ffmpegBin from 'ffmpeg-static'
import ffprobeBin from 'ffprobe-static'
import hash from 'hash.js'

ffmpeg.setFfmpegPath(ffmpegBin.path)
ffmpeg.setFfprobePath(ffprobeBin.path)
const sha256 = hash.sha256()

const generateThumbnail = (filePath, output) => {
  return new Promise((resolve, reject) => {
    const backdropPath = sha256.update(filePath).digest('hex') + '.png'

    ffmpeg(filePath)
      .on('end', () => resolve(backdropPath))
      .on('error', err => reject(err))
      .takeScreenshots({
        count: 1,
        timestamps: ['50%'],
        folder: output,
        filename: backdropPath,
      })
  })
}

const getVideoRuntime = filePath => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath).ffprobe((err, data) => {
      if (err) reject(err)

      const runtime = data.format.duration
      resolve(runtime)
    })
  })
}

const getVideoInfo = (videoData, output) => {
  const { filePath } = videoData
  return Promise.all([
    getVideoRuntime(filePath),
    generateThumbnail(filePath, output),
  ]).then(([runtime, backdropPath]) =>
    Object.assign({}, videoData, { runtime, backdropPath }),
  )
}

const setup = (
}

export default getVideoInfo
