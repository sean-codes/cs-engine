module.exports = {
   create: function({ cs, attr }) {
      this.networkId = this.networkId

      this.pos = attr.pos

      this.friction = 0.9
      this.speed = cs.vector.create(0, 0)
      this.maxSpeed = 1
      this.angle = 0
      this.targetAngle = 0
      this.turnSpeed = 0
      this.maxTurnSpeed = 4
      this.forward = false
   },

   share: function({ cs }) {
      return [
         cs.math.round(this.pos.x, 10),
         cs.math.round(this.pos.y, 10),
         cs.math.round(this.angle, 10),
         cs.math.round(this.turnSpeed, 10),
         cs.math.round(this.speed.x, 10),
         cs.math.round(this.speed.y, 10),
         this.forward ? 1 : 0,
      ]
   },

   step: function({ cs }) {
      if (this.forward) {
         this.speed = cs.vector.create(
            cs.math.cos(this.angle) * this.maxSpeed,
            cs.math.sin(this.angle) * this.maxSpeed
         )
      }

      // calculate turnSpeed
      var changeAngleDirection = cs.math.angleToAngle(this.angle, this.targetAngle)
      if (Math.abs(changeAngleDirection) > this.maxTurnSpeed) {
         changeAngleDirection = this.maxTurnSpeed * cs.math.sign(changeAngleDirection)
      }
      this.turnSpeed = changeAngleDirection

      this.angle += this.turnSpeed
      this.pos = cs.vector.add(this.pos, cs.vector.scale(this.speed, cs.loop.delta))
      if (!this.forward) this.speed = cs.vector.scale(this.speed, this.friction)
   },
}
