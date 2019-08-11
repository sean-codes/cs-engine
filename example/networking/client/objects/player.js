cs.objects.player = {
   create: function() {
      this.networkId = this.networkId

      this.pos = cs.vector.create(0, 0)
      this.posFix = cs.vector.create(0, 0)

      this.speed = 0
      this.forward = false
      this.friction = 0.95
      this.turnSpeed = 0
      this.angle = 0
      this.angleFix = 0
      this.radius = 3

      this.read(this.snapshot)
   },

   read: function(snapshot) {
      this.networkId = snapshot.id

      this.posFix = cs.vector.min(cs.vector.create(snapshot[0], snapshot[1]), this.pos)
      this.speed = cs.vector.create(snapshot[2], snapshot[3])
      this.forward = snapshot[4] ? true : false
      this.angle = snapshot[5]
      this.turnSpeed = snapshot[6]
   },

   step: function() {
      // smoothing sync with server
      var posFixLength = cs.vector.length(this.posFix)
      if (posFixLength > 1) {
         var adjustSpeed = 0.1
         if (posFixLength > 20) adjustSpeed = 1
         var fix = cs.vector.scale(cs.vector.unit(this.posFix), adjustSpeed)
         this.pos = cs.vector.add(this.pos, fix)
         this.posFix = cs.vector.min(this.posFix, fix)
      }

      if (posFixLength > 20) {
         this.pos = this.posFix
         this.posFix = cs.vector.create(0, 0)
      }

      this.angle += this.turnSpeed
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
