import ffmpeg from 'fluent-ffmpeg'
import ffmpegBin from 'ffmpeg-static'
import ffprobeBin from 'ffprobe-static'
import hash from 'hash.js'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

ffmpeg.setFfmpegPath(ffmpegBin.path.replace('app.asar', 'app.asar.unpacked'))
ffmpeg.setFfprobePath(ffprobeBin.path.replace('app.asar', 'app.asar.unpacked'))
const sha256 = hash.sha256()

const generateThumbnail = (filePath, output) => {
  return new Promise((resolve, reject) => {
    const thumbnailPath = sha256.update(filePath).digest('hex') + '.png'

    ffmpeg(filePath)
      .on('end', () => resolve(thumbnailPath))
      .on('error', err => reject(err))
      .takeScreenshots({
        count: 1,
        timestamps: ['50%'],
        folder: output,
        filename: thumbnailPath,
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
  ]).then(([runtime, thumbnailPath]) =>
    Object.assign({}, videoData, { runtime, thumbnailPath }),
  )
}

const setup = (
  output,
  inputFunc,
  outputFunc,
  errFunc = null,
  completeFunc = null,
) => {
  const videoFiles$ = new Subject()

  videoFiles$
    .pipe(mergeMap(videoData => getVideoInfo(videoData, output)))
    .subscribe(outputFunc, errFunc, completeFunc)

  inputFunc(videoFiles$)
}

export { getVideoInfo, setup }
