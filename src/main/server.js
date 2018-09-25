import http from 'http'

import send from 'send'

export default function createServer() {
  const server = http.createServer(function onRequest(req, res) {
    send(req, req.url).pipe(res)
  })

  return server
}
