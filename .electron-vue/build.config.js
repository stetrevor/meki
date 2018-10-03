const path = require('path')
const os = require('os')

const ignore = {
  darwin: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web|coverage|temp))|(ff(mpeg|probe)-static\/bin\/(linux|win32))|\.gitkeep/,
  linux: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web|coverage|temp))|(ff(mpeg|probe)-static\/bin\/(darwin|win32))|\.gitkeep/,
  mas: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web|coverage|temp))|(ff(mpeg|probe)-static\/bin\/(linux|win32))|\.gitkeep/,
  win32: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web|coverage|temp))|(ff(mpeg|probe)-static\/bin\/(linux|darwin))|\.gitkeep/,
}[os.platform()]

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
  ignore,
  out: path.join(__dirname, '../build'),
  overwrite: true,
  platform: process.env.BUILD_TARGET || 'all',
  appCopyright: 'Copyright © 2018, Stephen Trevor Wong',
  appVersion: '1.0.0',
}
