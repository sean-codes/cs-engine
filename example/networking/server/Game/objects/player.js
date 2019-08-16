module.exports = {
   create: function({ cs, attr }) {
      this.socket = attr.socket
      this.pos = attr.pos

      this.friction = 0.975
      this.speed = cs.vector.create(0, 0)
      this.maxSpeed = 1.25
      this.angle = 0
      this.targetAngle = 0
      this.turnSpeed = 0
      this.maxTurnSpeed = 4

      this.forward = false
      this.fire = false

      var Timer = function(options) {
         this.duration = options.duration
         this.time = cs.default(options.start, this.duration)
         this.percent = 0

         this.tick = function() {
            this.time = Math.max(this.time - 1, 0)
            this.percent = 1 - (this.time / this.duration)
         }

         this.start = function() {
            if (!this.time) {
               this.time = this.duration
               return true
            }

            return false
         }
      }

      this.fireTimer = cs.timer.create({ duration: 15 })

      cs.script.exec('networkObjects.objectCreate', { object: this })
   },

   share: function({ cs }) {
      return {
         socketId: this.socket.id,
         pos: this.pos,
         speed: this.speed,
         maxSpeed: this.maxSpeed,
         turnSpeed: this.maxTurnSpeed,
         friction: this.friction
      }
   },

   snapshotWrite: function({ cs }) {
      return {
         x: cs.math.round(this.pos.x, 1000),
         y: cs.math.round(this.pos.y, 1000),
         a: cs.math.round(this.angle, 10),
         ts: cs.math.round(this.turnSpeed, 10),
         sx: cs.math.round(this.speed.x, 1000),
         sy: cs.math.round(this.speed.y, 1000),
         f: this.forward ? 1 : 0,
      }
   },

   step: function({ cs }) {
      if (this.forward) {
         this.speed = cs.vector.create(
            cs.math.cos(this.angle) * this.maxSpeed,
            cs.math.sin(this.angle) * this.maxSpeed
         )
      }

      if (this.fire && cs.timer.start(this.fireTimer)) {
         cs.object.create({
            type: 'bullet',
            attr: {
               pos: this.pos,
               angle: this.angle,
               speed: cs.vector.length(this.speed) + 0.5
            }
         })
      }

      // calculate turnSpeed
      var changeAngleDirection = cs.math.angleToAngle(this.angle, this.targetAngle)
      if (Math.abs(changeAngleDirection) > this.maxTurnSpeed) {
         changeAngleDirection = this.maxTurnSpeed * cs.math.sign(changeAngleDirection)
      }
      this.turnSpeed = changeAngleDirection

      this.angle += this.turnSpeed * cs.loop.delta
      this.pos = cs.vector.add(this.pos, cs.vector.scale(this.speed, cs.loop.delta))
      if (!this.forward) this.speed = cs.vector.scale(this.speed, this.friction)

      if (this.pos.x < 0 || this.pos.x > cs.room.width) this.pos.x = this.pos.x < 0 ? 0 : cs.room.width
      if (this.pos.y < 0 || this.pos.y > cs.room.width) this.pos.y = this.pos.y < 0 ? 0 : cs.room.height
   },

   destroy: function({ cs }) {
      cs.script.exec('networkObjects.objectDestroy', { object: this })
   }
}
