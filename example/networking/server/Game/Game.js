const CS = require('cs-engine/main.headless.js')

module.exports = class Game {
   constructor(server) {
      this.server = server

      this.lastUpdate = Date.now()
      this.updateInterval = 1000 / 20

      this.cs = new CS({
         objects: {
            player: require('./objects/player'),
            bullet: require('./objects/bullet'),
         },

         scripts: {
            snapshot: require('./scripts/snapshot'),
            networkObjects: require('./scripts/networkObjects')
         },

         room: { width: 400, height: 400 },
         step: this.gamestep.bind(this),
         global: {
            server: this.server
         }
      })
   }

   playerCreate(socket) {
      this.cs.script.exec('networkObjects.sendSocketNetworkObjects', { socket })

      return this.cs.object.create({
         type: 'player',
         attr: {
            socket: socket,
            pos: {
               x: this.cs.room.width / 2,
               y: this.cs.room.height / 2,
            }
         }
      })
   }

   playerDestroy(gameObject) {
      this.cs.object.destroy(gameObject)
   }

   gamestep() {
      this.sendSnapshotSmall()
   }

   sendSnapshotSmall() {
      if (Date.now() - this.lastUpdate > this.updateInterval) {
         this.lastUpdate = Date.now()

         const snapshot = this.cs.script.exec('snapshot')

         this.server.broadcast({
            func: 'snapshot',
            data: snapshot
         })
      }
   }
}
