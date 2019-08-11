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
      this.send({
         func: 'connect',
         data: {
            socketId: this.id,
            gameObjectId: this.gameObject.core.id
         }
      })
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
         case 'control': {
            const fix = this.ping / (1000/60)
            var cs = this.server.cs
            var object = this.gameObject
            var { forward, angle, fire } = parsedJson.data

            object.targetAngle = angle
            object.forward = forward
            object.fire = fire

            break
         }

         case 'ping': {
            this.ping = Date.now() - parsedJson.data
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
