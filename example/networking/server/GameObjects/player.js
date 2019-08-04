module.exports = {
   create: function({ cs }) {
      this.share = true
      this.keys = { up: false, down: false, left: false, right: false }
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

   step: function({ cs }) {
      if (this.forward) this.speed = this.maxSpeed
      if (!this.forward) this.speed = 0

      var changeAngleDirection = cs.math.angleToAngle(this.targetAngle, this.angle)
      if (Math.abs(changeAngleDirection > this.maxTurnSpeed)) {
         changeAngleDirection = this.maxTurnSpeed * cs.math.sign(changeAngleDirection)
      }
      
      this.angle -= changeAngleDirection
      this.pos.x += cs.math.cos(this.angle) * (this.speed * cs.loop.delta)
      this.pos.y += cs.math.sin(this.angle) * (this.speed * cs.loop.delta)
   }
}
