cs.objects.player = {
   create: function() {
      this.networkId = this.id
      this.nx = 0
      this.ny = 0
      this.x = cs.default(this.x, 0)
      this.y = cs.default(this.y, 0)
      this.speed = 1
      this.speedX = 0
      this.speedY = 0
      this.radius = 3
      this.keys = { up: false, down: false, left: false, right: false }
   },

   step: function() {
      var speed = 1
      if (this.keys.left && !this.keys.right) this.speedX = -speed
      if (this.keys.right && !this.keys.left) this.speedX = speed
      if (!this.keys.left && !this.keys.right) this.speedX = 0
      if (this.keys.up && !this.keys.down) this.speedY = -speed
      if (this.keys.down && !this.keys.up) this.speedY = speed
      if (!this.keys.down && !this.keys.up) this.speedY = 0


      if (Math.abs(this.nx) > 5) {
         this.x += Math.sign(this.nx) * 0.1
         this.nx += Math.sign(this.nx) * 0.1
      }

      if (Math.abs(this.ny) > 5) {
         this.y += Math.sign(this.ny) * 0.1
         this.ny += Math.sign(this.ny) * 0.1
      }

      this.x += this.speedX// * cs.loop.delta
      this.y += this.speedY //* cs.loop.delta

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
         lines: [`nx: ${this.nx}`, `ny: ${this.ny}`],
         lineHeight: 2
      })
   }
}
