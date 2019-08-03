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
         case 'keyboard': {
            this.gameObject.keys = parsedJson.data
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
