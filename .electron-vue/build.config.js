const path = require('path')

/**
 * `electron-packager` options
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-packager.html
 */
module.exports = {
  arch: 'x64',
  asar: {
    unpack: '**/node_modules/{ffmpeg-static,ffprobe-static}/**',
  },
  dir: path.join(__dirname, '../'),
  icon: path.join(__dirname, '../build/icons/icon'),
  ignore: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web|coverage|temp))|\.gitkeep/,
  out: path.join(__dirname, '../build'),
  overwrite: true,
  platform: process.env.BUILD_TARGET || 'all',
}
