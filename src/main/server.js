import http from 'http'
import fs from 'fs'
import querystring from 'querystring'

import send from 'send'
import srt2vtt from 'srt-to-vtt'

export default function createServer() {
  const server = http.createServer(function onRequest(req, res) {
    if (req.url.endsWith('.srt')) {
      const filePath = querystring.unescape(req.url.slice(1))
      const stream = fs.createReadStream(filePath)

      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'text/vtt')
      stream.pipe(srt2vtt()).pipe(res)
    } else {
      send(req, req.url)
        .on('headers', (res, path, stat) => {
          res.setHeader('Access-Control-Allow-Origin', '*')
        })
        .pipe(res)
    }
  })

  return server
}
