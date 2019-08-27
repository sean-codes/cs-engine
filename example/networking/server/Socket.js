module.exports = class Socket {
   constructor(ws, server, id, game) {
      console.log('SOCKET: open')
      this.server = server
      this.ws = ws
      this.id = id
      this.game = game
      this.gameObject = undefined
      this.ping = 0

      this.ws.on('message', (data) => this.message(data))
      this.ws.on('close', (data) => this.close(data))
      this.pingInterval = setInterval(() => this.checkPing(), 1000)
   }

   createPlayer() {
      this.gameObject = this.game.playerCreate(this)
   }

   checkPing() {
      this.send({
         func: 'ping',
         data: {
            now: Date.now(),
            ping: this.ping
         }
      })
   }

   message(jsonData) {
      const parsedJson = JSON.parse(jsonData)
      switch (parsedJson.func) {
         case 'ping': {
            this.ping = Date.now() - parsedJson.data
            break
         }

         case 'game': {
            this.game.socketMessage(this, parsedJson.data)
            break
         }
      }
   }

   close(data) {
      console.log('SOCKET: close')
      this.server.closeConnection(this)
      clearInterval(this.pingInterval)
   }

   send(data) {
      this.ws.send(typeof data === 'String' ? data : JSON.stringify(data))
   }
}
