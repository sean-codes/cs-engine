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
            const fix = this.ping / (1000/60)
            var cs = this.server.cs
            var object = this.gameObject
            var newKeys = parsedJson.data
            var oldKeys = object.keys


            // turn prediction
            for (const key of [
               { name: 'left', dir: -object.turnSpeed },
               { name: 'right', dir: object.turnSpeed },
            ]) {
               const { name, dir, axis } = key
               const up = !newKeys[name] && oldKeys[name]
               const down = newKeys[name] && !oldKeys[name]

               if (down || up) console.log('fix', fix * dir)
               if (down) object.direction += dir * fix
               if (up) object.direction -= dir * fix
            }

            // forward prediction
            const forwardUp = !newKeys.up && oldKeys.up
            const forwardDown = newKeys.up && !oldKeys.up
            const xFix = cs.math.cos(object.direction) * fix
            const yFix = cs.math.sin(object.direction) * fix

            if (forwardUp) {
               console.log('up', -xFix, -yFix)
               object.x -= xFix
               object.y -= yFix
            }

            if (forwardDown) {
               console.log('down', xFix, yFix)
               object.x += xFix
               object.y += yFix
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
