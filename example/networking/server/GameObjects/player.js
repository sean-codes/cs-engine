module.exports = {
   create: function({ cs }) {
      this.share = true
      this.keys = { up: false, down: false, left: false, right: false }
      this.networkId = this.networkId

      this.x = this.x
      this.y = this.y
      this.speed = 0
      this.maxSpeed = 1
      this.direction = 0
      this.turnSpeed = 4
   },

   step: function({ cs }) {
      if (this.keys.right) this.direction += this.turnSpeed
      if (this.keys.left) this.direction -= this.turnSpeed
      if (this.keys.up) this.speed = this.maxSpeed
      if (!this.keys.up) this.speed = 0

      this.x += cs.math.cos(this.direction) * (this.speed * cs.loop.delta)
      this.y += cs.math.sin(this.direction) * (this.speed * cs.loop.delta)
   }
}
