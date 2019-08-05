module.exports = {
   create: function({ cs }) {
      this.networkId = this.networkId

      this.pos = this.pos

      this.speed = 0
      this.maxSpeed = 1
      this.angle = 0
      this.targetAngle = 0
      this.turnSpeed = 0
      this.maxTurnSpeed = 4
      this.forward = false
   },

   share: function({ cs }) {
      return {
         x: cs.math.round(this.pos.x, 10),
         y: cs.math.round(this.pos.y, 10),
         s: cs.math.round(this.speed, 10),
         a: cs.math.round(this.angle, 10),
         t: cs.math.round(this.turnSpeed, 10),
      }
   },

   step: function({ cs }) {
      this.speed = this.forward ? this.maxSpeed : 0

      // calculate turnSpeed
      var changeAngleDirection = cs.math.angleToAngle(this.angle, this.targetAngle)
      if (Math.abs(changeAngleDirection) > this.maxTurnSpeed) {
         changeAngleDirection = this.maxTurnSpeed * cs.math.sign(changeAngleDirection)
      }
      this.turnSpeed = changeAngleDirection

      this.angle += this.turnSpeed
      this.pos.x += cs.math.cos(this.angle) * (this.speed * cs.loop.delta)
      this.pos.y += cs.math.sin(this.angle) * (this.speed * cs.loop.delta)
   },
}
