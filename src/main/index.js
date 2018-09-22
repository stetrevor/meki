import { app, BrowserWindow, ipcMain } from 'electron'

import { setup as videoInfoSetup } from './video-info'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('ready-to-show', () => {
    const dirname =
      process.env.NODE_ENV === 'production' ? 'userData' : 'temp/paw'
    const output = app.getPath(dirname)

    videoInfoSetup(
      output,
      videoFiles$ => {
        ipcMain.on('video-info-request', (_, videoData) =>
          videoFiles$.next(videoData),
        )
      },
      info => mainWindow.contents.send('video-info-response', info),
    )
  })
}

app.on('ready', createWindow)

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
