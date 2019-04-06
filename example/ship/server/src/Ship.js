module.exports = class Ship {
   constructor(id, ws, room) {
      // network
      this.id = id
      this.ws = ws
      this.ws.on('message', (data) => this.message(data))
      this.ws.on('close', (data) => this.close(data))

      // game
      this.room = room
      this.x = room.width/2
      this.y = room.height/2
      this.keys = {
         left: false,
         right: false,
         forward: false
      }

      this.xSpeed = 0
      this.ySpeed = 0
      this.turnSpeed = 0
      this.maxTurnSpeed = 15
      this.maxSpeed = 2
      this.direction = 0

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
         const data = JSON.parse(jsonMessage)
         const updatedKeys = {
            left: data.keys.left ? true : false,
            right: data.keys.right ? true : false,
            forward: data.keys.forward ? true : false
         }

         this.keys = updatedKeys
         this.room.change()
      } catch(e) {
         console.log('could not parse message', e)
      }

   }

   send(message) {
      this.ws.send(JSON.stringify(message))
   }

   close() {
      this.room.destroyShip(this)
   }

   update() {
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
         this.xSpeed += this.cos(this.direction) * 0.25
         this.ySpeed += this.sin(this.direction) * 0.25

         var maxXSpeed = Math.abs(this.cos(this.direction) * this.maxSpeed)
         var maxYSpeed = Math.abs(this.sin(this.direction) * this.maxSpeed)

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

   cos(angleInDegrees) {
      return Math.cos((angleInDegrees-90) * Math.PI/180)
   }

   sin(angleInDegrees) {
      return Math.sin((angleInDegrees-90) * Math.PI/180)
   }
}
