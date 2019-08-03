const Socket = require('./Socket')
const CS = require('cs-engine/src/main.headless.js')
const GameObjectPlayer = require('./GameObjects/Player')

module.exports = class Server {
   constructor() {
      this.sockets = []
      this.nextId = 1
      this.lastUpdate = Date.now()
      this.updateInterval = 1000 / 60

      this.cs = new CS({
         objects: {
            player: GameObjectPlayer
         },

         room: { width: 300, height: 300 },
         step: this.networkStep.bind(this)
      })
   }

   openConnection(ws, req) {
      const id = this.nextId++
      var gameObjectPlayer = this.cs.object.create({
         type: 'player',
         attr: {
            socketId: id,
            x: this.cs.room.width / 2,
            y: this.cs.room.height / 2,
         }
      })

      var socket = new Socket(ws, this, id, gameObjectPlayer)
      socket.send({
         func: 'connect',
         data: {
            socketId: id,
            gameObjectId: gameObjectPlayer.core.id
         }
      })

      this.sockets.push(socket)
   }

   closeConnection(socket) {
      this.cs.object.destroy(socket.gameObject)
      this.sockets = this.sockets.filter(s => s.id !== socket.id)
   }

   networkStep() {
      // console.log('hi')
      if (Date.now() - this.lastUpdate > this.updateInterval) {
         this.lastUpdate = Date.now()

         let update = []
         for (let object of this.cs.object.every()) {
            if (object.share) {
               update.push({
                  type: object.core.type,
                  attr: {
                     id: object.core.id,
                     x: Math.round(object.x),
                     y: Math.round(object.y),
                     speedX: object.speedX,
                     speedY: object.speedY
                  }
               })
            }
         }

         for (var socket of this.sockets) {
            socket.send({
               func: 'state',
               data: {
                  sent: Date.now(),
                  ping: socket.ping,
                  objects: update
               }
            })
         }
      }
   }

   broadcast(data) {
      for (var socket of this.sockets) {
         socket.send(data)
      }
   }
}
