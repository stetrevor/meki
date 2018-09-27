import { app, BrowserWindow, ipcMain } from 'electron'

import path from 'path'
import fs from 'fs'

import { setup as videoInfoSetup } from './video-info'
import createServer from './server'

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

function setupVideoInfo() {
  const output =
    process.env.NODE_ENV === 'production'
      ? path.join(app.getPath('userData'), 'images')
      : path.join(__dirname, '../../temp', 'images')

  fs.existsSync(output) ? '' : fs.mkdirSync(output)

  videoInfoSetup(
    output,
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
        mainWindow.webContents.send('server-address-reponse', server.address())
      })
    }
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
