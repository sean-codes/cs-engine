cs.objects.player = {
   create: function() {
      this.networkId = this.id
      this.nx = 0
      this.ny = 0
      this.x = cs.default(this.x, 0)
      this.y = cs.default(this.y, 0)

      this.maxSpeed = 1
      this.radius = 3
      this.speed = 0
      this.direction = 0
      this.turnSpeed = 4
      this.keys = { up: false, left: false, right: false }
   },

   step: function() {
      if (this.networkId == cs.global.self) {
         if (this.keys.right) this.direction += this.turnSpeed
         if (this.keys.left) this.direction -= this.turnSpeed
         if (this.keys.up) this.speed = this.maxSpeed
         if (!this.keys.up) this.speed = 0
      }

      if (Math.abs(this.nx) > 2) {
         this.x += Math.sign(this.nx) * 0.1
         this.nx += Math.sign(this.nx) * 0.1
      }

      if (Math.abs(this.ny) > 2) {
         this.y += Math.sign(this.ny) * 0.1
         this.ny += Math.sign(this.ny) * 0.1
      }

      this.x += cs.math.cos(this.direction) * this.speed
      this.y += cs.math.sin(this.direction) * this.speed

      if (this.networkId == cs.global.self) {
         cs.camera.follow({
            x: this.x,
            y: this.y
         })
      }
   },

   draw: function() {
      cs.draw.setColor('#39D')
      cs.draw.circle({ x: this.x, y: this.y, radius: this.radius, fill: true })

      cs.draw.setColor('#FFF')
      cs.draw.setWidth(0.5)
      cs.draw.circle({ x: this.x, y: this.y, radius: this.radius })

      cs.draw.setColor('#FFF')
      cs.draw.setFont({ size: 2, family: 'monospace' })
      cs.draw.setTextCenter()
      cs.draw.text({
         x: this.x,
         y: this.y + 5,
         lines: [
            `nx: ${cs.math.round(this.nx, 100)}`,
            `ny: ${cs.math.round(this.nx, 100)}`
         ],
         lineHeight: 2
      })

      // draw direction
      var dirPoint = {
         x: this.x + cs.math.cos(this.direction) * this.radius,
         y: this.y + cs.math.sin(this.direction) * this.radius
      }

      cs.draw.setWidth(0.5)
      cs.draw.setColor('#FFF')
      cs.draw.line({
         points: [{ x: this.x, y: this.y }, dirPoint ]
      })
   }
}
