module.exports = class Socket {
   constructor(ws, server, id, gameObject) {
      console.log('SOCKET: open')
      this.server = server
      this.ws = ws
      this.id = id
      this.gameObject = gameObject
      this.ping = 0

      this.ws.on('message', (data) => this.message(data))
      this.ws.on('close', (data) => this.close(data))
   }

   message(jsonData) {
      const parsedJson = JSON.parse(jsonData)

      switch (parsedJson.func) {
         case 'control': {
            const fix = this.ping / (1000/60)
            var cs = this.server.cs
            var object = this.gameObject
            var { forward, angle } = parsedJson.data

            object.targetAngle = angle
            object.forward = forward
            break;
         }

         case 'ping': {
            this.ping = Date.now() - parsedJson.data
         }
      }
   }

   close(data) {
      console.log('SOCKET: close')
      this.server.closeConnection(this)
   }

   send(data) {
      this.ws.send(typeof data === 'String' ? data : JSON.stringify(data))
   }
}
