cs.objects.player = {
   create: function() {
      if (this.snapshot) this.read(this.snapshot)
      this.networkId = this.networkId

      this.pos = this.pos
      this.posFix = cs.vector.create(0, 0)

      this.speed = 0
      this.turnSpeed = 0
      this.angle = 0
      this.angleFix = 0
      this.radius = 3

      this.snapshot = {
         frames: [],
         time: 0,
         when: Date.now()
      }
   },

   read: function(snapshot) {

      this.networkId = snapshot.id
      if (!this.pos) this.pos = cs.vector.create(snapshot.x, snapshot.y)

      this.posFix = cs.vector.min(cs.vector.create(snapshot.x, snapshot.y), this.pos)
      this.speed = snapshot.s
      this.angle = snapshot.a
      this.turnSpeed = snapshot.t
   },

   step: function() {
      // smoothing sync with server
      var posFixLength = cs.vector.length(this.posFix)
      if (posFixLength > 1) {
         var adjustSpeed = 0.1
         if (posFixLength > 10) adjustSpeed = 0.5
         if (posFixLength > 20) adjustSpeed = 1
         var fix = cs.vector.scale(cs.vector.unit(this.posFix), adjustSpeed)
         this.pos = cs.vector.add(this.pos, fix)
         this.posFix = cs.vector.min(this.posFix, fix)
      }

      this.angle += this.turnSpeed
      this.pos.x += cs.math.cos(this.angle) * (this.speed * cs.loop.delta)
      this.pos.y += cs.math.sin(this.angle) * (this.speed * cs.loop.delta)
   },

   draw: function() {
      cs.draw.setColor('#39D')
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius, fill: true })

      cs.draw.setColor('#FFF')
      cs.draw.setWidth(0.5)
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius })

      // draw direction
      var dirPoint = {
         x: this.pos.x + cs.math.cos(this.angle) * this.radius,
         y: this.pos.y + cs.math.sin(this.angle) * this.radius
      }

      cs.draw.setWidth(0.5)
      cs.draw.setColor('#FFF')
      cs.draw.line({
         points: [{ x: this.pos.x, y: this.pos.y }, dirPoint ]
      })
   }
}
