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
            network: require('./scripts/networkServer')
         },

         room: { width: 400, height: 400 },

         global: {
            server: this.server,
            lastUpdate: Date.now(),
            updateInterval: 1000 / 20
         },

         start: function({ cs }) {
            cs.script.exec('network.init')
         },

         step: function({ cs }) {
            if (Date.now() - cs.global.lastUpdate > cs.global.updateInterval) {
               cs.global.lastUpdate = Date.now()
               cs.script.exec('networkObjects.snapshot')
            }
         },
      })
   }

   socketConnect(socket) {
      this.cs.script.exec('network.connect', { socket })
   }

   socketDisconnect(socket) {
      this.cs.script.exec('network.disconnect', { socket })
   }

   message(data) {
      this.cs.network.onmessage(data)
   }
}
