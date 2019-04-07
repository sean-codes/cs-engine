const {
   sin,
   cos
} = require('./math')

module.exports = class Ship {
   constructor(ws, room) {
      // network
      this.id = Math.round(Date.now() * Math.random() * 100000)
      this.ws = ws
      this.ws.on('message', (data) => this.message(data))
      this.ws.on('close', (data) => this.close(data))

      // game
      this.start = false
      this.room = room
      this.score = 0
      this.name = 'test'
      this.respawnTime = 0
      this.x = room.width/2
      this.y = room.height/2
      this.keys = {
         left: false,
         right: false,
         forward: false,
         shoot: false
      }

      this.xSpeed = 0
      this.ySpeed = 0
      this.turnSpeed = 0
      this.maxTurnSpeed = 15
      this.maxSpeed = 2
      this.direction = 0
      this.shoot = {
         delay: 30,
         wait: 0
      }

      this.send({
         func: 'id',
         data: {
            id: this.id
         }
      })
   }

   message(jsonMessage) {
      try {
         console.log('received', jsonMessage)
         const parsedMessage = JSON.parse(jsonMessage)
         const {
            func,
            data
         } = parsedMessage

         switch(func) {
            case 'control':
               // pls dont hack :]
               // should validate before using
               this.keys = data.keys
               this.x = data.x
               this.y = data.y
               this.xSpeed = data.xSpeed
               this.ySpeed = data.ySpeed
               this.direction = data.direction
               this.turnSpeed = data.turnSpeed

               this.room.broadcast({
                  func: 'change',
                  data: {
                     id: this.id,
                     name: this.name,
                     keys: this.keys,
                     x: this.x,
                     y: this.y,
                     direction: this.direction,
                     turnSpeed: this.turnSpeed,
                     xSpeed: this.xSpeed,
                     ySpeed: this.ySpeed,
                     sent: Date.now()
                  }
               })
               break

            case 'start':
               this.name = this.fixName(data.name)
               this.start = true
               this.room.shipStart(this)
               break
         }
      } catch(e) {
         console.log('could not parse message', e)
      }
   }

   fixName(name) {
      var fixedName = name.toString().slice(0, 10)
      if (!fixedName.length) {
         fixedName = ''
         var characters = 'abcdefghijklmnopqrstuvwxyz'
         for (var i = 0; i < 5; i++) {
            fixedName += characters[Math.floor(characters.length*Math.random())]
         }
      }

      return fixedName
   }

   send(message) {
      this.ws.send(JSON.stringify(message))
   }

   close() {
      this.room.destroyShip(this)
   }

   start() {

      this.respawn()
   }

   respawn() {
      this.x = Math.random() * this.room.width
      this.y = Math.random() * this.room.height

      this.room.broadcast({
         func: 'respawn',
         data: {
            id: this.id,
            x: this.x,
            y: this.y
         }
      })
   }

   update() {
      if (!this.start) return

      if (this.respawnTime) {
         this.respawnTime -= 1

         if (!this.respawnTime) {
            this.respawn()
         }
         return
      }

      // shoot timer
      if (this.shoot.wait) {
         this.shoot.wait -= 1
      }

      if (this.keys.shoot && !this.shoot.wait) {
         this.shoot.wait = this.shoot.delay
         this.room.addBullet(this)
         console.log('fire')
      }


      if (this.keys.left || this.keys.right) {
         if (this.keys.left) {
            this.turnSpeed += 0.25
         }

         if (this.keys.right) {
            this.turnSpeed -= 0.25
         }
      } else {
         this.turnSpeed -= (this.turnSpeed/10)
      }

      if (this.keys.forward) {
         this.forward = true
         this.xSpeed += cos(this.direction) * 0.25
         this.ySpeed += sin(this.direction) * 0.25

         var maxXSpeed = Math.abs(cos(this.direction) * this.maxSpeed)
         var maxYSpeed = Math.abs(sin(this.direction) * this.maxSpeed)

         this.xSpeed = Math.min(Math.abs(this.xSpeed), maxXSpeed) * Math.sign(this.xSpeed)
         this.ySpeed = Math.min(Math.abs(this.ySpeed), maxYSpeed) * Math.sign(this.ySpeed)
      } else {
         this.xSpeed -= (this.xSpeed/30)
         this.ySpeed -= (this.ySpeed/30)
      }

      // move ship
      this.direction += Math.min(Math.abs(this.turnSpeed), this.maxTurnSpeed) * Math.sign(this.turnSpeed)
      this.x += this.xSpeed
      this.y += this.ySpeed

      // prevent going off edges
      if(this.x < 0) this.x = 0
      if(this.x > this.room.width) this.x = this.room.width
      if(this.y < 0) this.y = 0
      if(this.y > this.room.height) this.y = this.room.height
   }
}
