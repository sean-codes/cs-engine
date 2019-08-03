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
            var object = this.gameObject
            var newKeys = parsedJson.data
            var oldKeys = object.keys

            // can we do something here? possibly boost/slow by socket ping
            for (const key of [
               { name: 'left', dir: -1, axis: 'x' },
               { name: 'right', dir: 1, axis: 'x' },
               { name: 'up', dir: -1, axis: 'y' },
               { name: 'down', dir: 1, axis: 'y' },
            ]) {
               const { name, dir, axis } = key
               const up = !newKeys[name] && oldKeys[name]
               const down = newKeys[name] && !oldKeys[name]

               const fix = this.ping / (1000/60)
               if (down) object[axis] += dir * fix
               if (up) object[axis] -= dir * fix
            }


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
