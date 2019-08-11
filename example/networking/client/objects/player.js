cs.objects.player = {
   create: function() {
      this.networkId = this.networkId

      this.pos = cs.vector.create(0, 0)
      this.posFix = cs.vector.create(0, 0)

      this.speed = 0
      this.forward = false
      this.friction = 0.9
      this.turnSpeed = 0
      this.angle = 0
      this.angleFix = 0
      this.radius = 3

      this.read(this.snapshot)
   },

   read: function(snapshot) {
      this.networkId = snapshot.id

      this.pos.x = cs.scripts.smooth(this.pos.x, snapshot[0], 100)
      this.pos.y = cs.scripts.smooth(this.pos.y, snapshot[1], 100)
      this.angle = cs.scripts.smooth(this.angle, snapshot[2], 100)
      this.turnSpeed = snapshot[3]
      this.speed = cs.vector.create(snapshot[4], snapshot[5])
      this.forward = snapshot[6] ? true : false
   },

   step: function() {
      this.angle += this.turnSpeed * cs.loop.delta
      this.pos = cs.vector.add(this.pos, cs.vector.scale(this.speed, cs.loop.delta))
      if (!this.forward) this.speed = cs.vector.scale(this.speed, this.friction)
   },

   draw: function() {
      cs.draw.setColor('#39D')
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius, fill: true })

      cs.draw.setWidth(0.5)
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius })

      // draw direction
      var dirPoint = {
         x: this.pos.x + cs.math.cos(this.angle) * this.radius,
         y: this.pos.y + cs.math.sin(this.angle) * this.radius
      }

      cs.draw.setWidth(0.5)
      cs.draw.line({
         points: [{ x: this.pos.x, y: this.pos.y }, dirPoint ]
      })

      // pos fix
      cs.draw.text({
         x: this.pos.x - 6,
         y: this.pos.y + 4,
         lines: [
            'xfix: ' + cs.math.round(this.posFix.x, 100),
            'yfix: ' + cs.math.round(this.posFix.y, 100),
         ]
      })
   }
}
