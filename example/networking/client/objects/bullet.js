cs.objects.bullet = {
   zIndex: 1,
   create: function({ cs, attr }) {
      this.radius = 1

      this.pos = cs.vector.create(
         attr.snapshot.x,
         attr.snapshot.y
      )

      this.read(attr.snapshot)
   },

   read: function(snapshot) {
      this.networkId = snapshot.id

      var x = cs.scripts.smooth(this.pos.x, snapshot.x, 100)
      var y = cs.scripts.smooth(this.pos.y, snapshot.y, 100)
      var speedX = snapshot.sx
      var speedY = snapshot.sy

      this.pos = cs.vector.create(x, y)
      this.speed = cs.vector.create(speedX, speedY)
   },

   step: function({ cs }) {
      this.pos = cs.vector.add(this.pos, this.speed)
   },

   draw: function({ cs }) {
      cs.draw.setWidth(0.5)
      cs.draw.circle({
         x: this.pos.x,
         y: this.pos.y,
         radius: this.radius,
         fill: true
      })
   }
}
