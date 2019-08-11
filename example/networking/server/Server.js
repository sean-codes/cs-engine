const Socket = require('./Socket')
const Game = require('./Game/Game')


module.exports = class Server {
   constructor() {
      this.sockets = []
      this.nextId = 1


      this.game = new Game(this)
   }

   openConnection(ws, req) {
      const id = this.nextId++
      const socket = new Socket(ws, this, id, this.game)
      this.sockets.push(socket)
      socket.createPlayer()
   }

   closeConnection(socket) {
      this.game.playerDestroy(socket.gameObject)
      this.sockets = this.sockets.filter(s => s.id !== socket.id)
   }

   broadcast(data) {
      for (var socket of this.sockets) {
         socket.send(data)
      }
   }
}
