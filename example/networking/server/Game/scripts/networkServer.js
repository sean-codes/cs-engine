module.exports = {
   connections: [],

   init() {
      const { cs } = this
      cs.network.setup({
         message: this.onMessage.bind(this)
      })
   },

   connect(socket) {
      const { cs } = this
      // 1. send player all the current network objects
      cs.script.networkObjects.sendSocketNetworkObjects(socket)
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

   disconnect(socket) {
      const { cs } = this
      const gameSocket = this.connections[socket.id]
      cs.object.destroy(gameSocket.object)
      delete this.connections[socket.id]
   },

   onMessage({ message: { socket, message } }) {
      const { cs } = this

      // message has the socket that sent it plus the message
      if (this.functions[message.func]) {
         const gameSocket = this.connections[socket.id]
         if (gameSocket) {
            this.functions[message.func](gameSocket, message.data)
         } else {
            console.log('game function without gamesocket?')
         }
      }
   },

   broadcast(message) {
      for (const socketId in this.connections) {
         const connection = this.connections[socketId]
         connection.socket.send(message)
      }
   },

   functions: {
      control: function (socket, data) {
         const { object } = socket

         if (object) {
            object.targetAngle = data.angle
            object.forward = data.forward
            object.fire = data.fire
         }
      }
   }
}
