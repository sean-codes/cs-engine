const CS = require('cs-engine/main.headless.js')

module.exports = class Game {
   constructor(server) {
      this.server = server

      this.cs = new CS({
         objects: {
            player: require('./objects/player'),
            bullet: require('./objects/bullet'),
         },

         scripts: {
            networkObjects: require('./scripts/networkObjects'),
            network: require('./scripts/networkServer'),
         },

         room: { width: 400, height: 400 },

         global: {
            server: this.server,
            lastUpdate: Date.now(),
            updateInterval: 1000 / 20,
         },

         start() {
            const { cs } = this
            cs.script.network.init()
         },

         step() {
            const { cs } = this
            if (Date.now() - cs.global.lastUpdate > cs.global.updateInterval) {
               cs.global.lastUpdate = Date.now()
               cs.script.networkObjects.snapshot()
            }
         },
      })
   }

   socketConnect(socket) {
      this.cs.script.network.connect(socket)
   }

   socketDisconnect(socket) {
      this.cs.script.network.disconnect(socket)
   }

   socketMessage(socket, message) {
      this.cs.network.onmessage({ socket, message })
   }
}
