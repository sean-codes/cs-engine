cs.objects.player = {
   create: function() {
      this.networkId = this.id

      this.pos = this.pos
      this.posFix = cs.vector.create(0, 0)

      this.maxSpeed = 1
      this.radius = 3
      this.speed = 0
      this.turnSpeed = 0
      this.maxTurnSpeed = 4
      this.angle = 0

      this.controlForward = false
      this.controlAngle = 0
   },

   step: function() {
      if (this.networkId == cs.global.self) {
         cs.camera.follow(this.pos)
         // uncomment to use clients angle (can be out of sync)
         // this.angle = cs.global.controller.angle
      }

      var posFixLength = cs.vector.length(this.posFix)
      if (posFixLength > 1) {
         var adjustSpeed = 0.1
         if (posFixLength > 10) adjustSpeed = 0.5
         if (posFixLength > 20) adjustSpeed = 1
         var fix = cs.vector.scale(cs.vector.unit(this.posFix), adjustSpeed)
         this.pos = cs.vector.add(this.pos, fix)
         this.posFix = cs.vector.min(this.posFix, fix)
      }

      this.pos.x += cs.math.cos(this.angle) * (this.speed * cs.loop.delta)
      this.pos.y += cs.math.sin(this.angle) * (this.speed * cs.loop.delta)
   },

   draw: function() {
      cs.draw.setColor('#39D')
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius, fill: true })

      cs.draw.setColor('#FFF')
      cs.draw.setWidth(0.5)
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius })

      // for debuggin fixes
      // cs.draw.setColor('#FFF')
      // cs.draw.setFont({ size: 2, family: 'monospace' })
      // cs.draw.setTextCenter()
      // cs.draw.text({
      //    x: this.pos.x,
      //    y: this.pos.y + 5,
      //    lines: [
      //       `fixX: ${cs.math.round(this.posFix.x, 100)}`,
      //       `fixY: ${cs.math.round(this.posFix.y, 100)}`
      //    ],
      //    lineHeight: 2
      // })

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
