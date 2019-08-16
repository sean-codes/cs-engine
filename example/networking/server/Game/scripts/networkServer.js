module.exports = {
   connections: [],

   init({ cs }) {
      cs.network.setup({
         message: this.onMessage.bind(this)
      })
   },

   connect({ cs, socket }) {
      // 1. send player all the current network objects
      cs.script.exec('networkObjects.sendSocketNetworkObjects', { socket })
      // 2. create player object
      this.connections[socket.id] = { socket: socket, object: undefined }
      this.connections[socket.id].object = cs.object.create({
         type: 'player',
         attr: {
            socket: socket,
            pos: {
               x: cs.room.width / 2,
               y: cs.room.height / 2,
            }
         }
      })
   },

   disconnect({ cs, socket }) {
      let gameSocket = this.connections[socket.id]
      if (gameSocket) {
         cs.object.destroy(gameSocket.object)
         this.connections = this.connections.filter(c => c.socket.id !== socket.id)
      }
   },

   onMessage({ cs, message: { socket, message } }) {
      // message has the socket that sent it plus the message
      if (this.functions[message.func]) {
         var gameSocket = this.connections[socket.id]
         if (gameSocket) {
            this.functions[message.func]({
               socket: gameSocket,
               data: message.data
            })
         } else {
            console.log('game function without gamesocket?')
         }
      }
   },

   broadcast({ cs, message }) {
      for (let socketId in this.connections) {
         let connection = this.connections[socketId]
         connection.socket.send(message)
      }
   },

   functions: {
      'control': function({ socket, data }) {
         let object = socket.object

         if (object) {
            object.targetAngle = data.angle
            object.forward = data.forward
            object.fire = data.fire
         }
      }
   }
}
