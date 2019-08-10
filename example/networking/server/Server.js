const Socket = require('./Socket')
const CS = require('cs-engine/main.headless.js')

module.exports = class Server {
   constructor() {
      this.sockets = []
      this.nextId = 1
      this.lastUpdate = Date.now()
      this.updateInterval = 1000 / 15

      this.cs = new CS({
         objects: {
            player: require('./Game/objects/player')
         },

         scripts: {
            snapshot: require('./Game/scripts/snapshot')
         },

         room: { width: 300, height: 300 },
         step: this.gamestep.bind(this)
      })
   }

   openConnection(ws, req) {
      const id = this.nextId++
      var gameObjectPlayer = this.cs.object.create({
         type: 'player',
         attr: {
            socketId: id,
            pos: {
               x: this.cs.room.width / 2,
               y: this.cs.room.height / 2,
            }
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

   gamestep() {
      this.sendSnapshotSmall()
   }

   sendSnapshotSmall() {
      if (Date.now() - this.lastUpdate > this.updateInterval) {
         this.lastUpdate = Date.now()

         const snapshot = this.cs.script.exec('snapshot')

         for (var socket of this.sockets) {
            socket.send({
               func: 'snapshot',
               data: {
                  sent: Date.now(),
                  ping: socket.ping,
                  snapshot
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
