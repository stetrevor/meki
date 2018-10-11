import http from 'http'

import send from 'send'

export default function createServer() {
  const server = http.createServer(function onRequest(req, res) {
    send(req, req.url)
      .on('headers', (res, path, stat) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
      })
      .pipe(res)
  })

  return server
}
