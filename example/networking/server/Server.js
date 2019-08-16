const Socket = require('./Socket')
const Game = require('./Game/Game')


module.exports = class Server {
   constructor() {
      this.sockets = []
      this.nextId = 1


      this.game = new Game(this)
   }

   openConnection(ws, req) {
      this.nextId += 1
      const id = this.nextId
      const socket = new Socket(ws, this, id, this.game)
      this.sockets.push(socket)
      socket.send({ func: 'connect', data: id })
      this.game.socketConnect(socket)
   }

   closeConnection(socket) {
      this.game.socketDisconnect(socket)
      this.sockets = this.sockets.filter(s => s.id !== socket.id)
   }

   broadcast(data) {
      for (var socket of this.sockets) {
         socket.send(data)
      }
   }
}
