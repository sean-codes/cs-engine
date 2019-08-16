const express = require('express')
const WebSocket = require('ws')
const Server = new require('./Server')
const CONFIG = require('../config')

// ----------------------------
// static assets
// ----------------------------
const app = express()

app.use(express.static('./client', {
   maxage: '1d'
}))

app.use('/cs-engine', express.static('../../', {
   maxage: '1d'
}))


app.listen(CONFIG.PORT.STATIC_ASSETS, () => {
   console.log(`listening on ${CONFIG.PORT.STATIC_ASSETS}`)
})

// ----------------------------
// websockets
// ----------------------------
const server = new Server()
const wss = new WebSocket.Server({ port: CONFIG.PORT.WEBSOCKET })
console.log(`websockets on ${CONFIG.PORT.WEBSOCKET}`)

wss.on('connection', (ws, req) => {
   console.log('new connection')
   server.openConnection(ws, req)
})
