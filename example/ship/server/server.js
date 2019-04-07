const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 9999 })
const Room = require('./src/Room')

const room = new Room()

wss.on('connection', function connection(ws) {
   room.addShip(ws)
})

wss.on('close', function connection(ws) {
   console.log('disconnect')
   // room.addShip(ws)
})
