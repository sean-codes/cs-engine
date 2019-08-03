module.exports = {
   create: function({ cs }) {
      this.share = true
      this.keys = { up: false, down: false, left: false, right: false }
      this.networkId = this.networkId
      this.speedX = 0
      this.speedY = 0
   },

   step: function({ cs }) {
      var speed = 1
      if (this.keys.left && !this.keys.right) this.speedX = -speed
      if (this.keys.right && !this.keys.left) this.speedX = speed
      if (!this.keys.left && !this.keys.right) this.speedX = 0
      if (this.keys.up && !this.keys.down) this.speedY = -speed
      if (this.keys.down && !this.keys.up) this.speedY = speed
      if (!this.keys.down && !this.keys.up) this.speedY = 0

      this.x += this.speedX * cs.loop.delta
      this.y += this.speedY * cs.loop.delta
   }
}
