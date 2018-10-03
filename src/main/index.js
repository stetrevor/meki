import { app, BrowserWindow, ipcMain } from 'electron'

import path from 'path'
import fs from 'fs'

import settings from 'electron-settings'

import { setup as videoInfoSetup } from './video-info'
import createServer from './server'

if (process.env.NODE_ENV !== 'production') {
  settings.setPath(path.resolve(__dirname, '../../temp/settings'))
}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow, server
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 1000,
    useContentSize: true,
    width: 2000,
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

let OUTPUT
function setupVideoInfo() {
  OUTPUT =
    process.env.NODE_ENV === 'production'
      ? path.join(app.getPath('userData'), 'images')
      : path.join(__dirname, '../../temp', 'images')

  fs.existsSync(OUTPUT) ? '' : fs.mkdirSync(OUTPUT)

  videoInfoSetup(
    OUTPUT,
    videoFiles$ => {
      ipcMain.on('video-info-request', (_, videoData) =>
        videoFiles$.next(videoData),
      )
    },
    info => mainWindow.webContents.send('video-info-response', info),
  )
}

app.on('ready', () => {
  createWindow()
  setupVideoInfo()

  ipcMain.on('server-address-request', event => {
    if (server) {
      event.sender.send('server-address-response', server.address())
    } else {
      server = createServer()
      const port = process.env.NODE_ENV === 'production' ? 0 : 3000

      server.listen(port, 'localhost', () => {
        mainWindow.webContents.send('server-address-response', server.address())
      })
    }
  })

  ipcMain.on('settings-video-player-request', event => {
    const videoPlayerSettings = settings.get('videoPlayer', {
      muted: false,
      volume: 100,
    })
    event.sender.send('settings-video-player-response', videoPlayerSettings)
  })

  ipcMain.on('delete-image-file-request', (event, filePath) => {
    fs.unlink(path.resolve(OUTPUT, filePath), err => {
      if (err) throw err

      const success = !err
      event.sender.send('delete-image-file-response', success, filePath)
    })
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
