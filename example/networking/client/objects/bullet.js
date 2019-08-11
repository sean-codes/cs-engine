cs.objects.bullet = {
   create: function({ cs, attr }) {
      this.radius = 4
   },

   read: function(snapshot) {
      console.log(snapshot)
      var x = snapshot[0]
      var y = snapshot[1]
      var speedX = snapshot[2]
      var speedY = snapshot[3]

      this.pos = cs.vector.create(x, y)
      this.speed = cs.vector.create(speedX, speedY)
   },

   step: function({ cs }) {
      this.pos = cs.vector.add(this.pos, this.speed)
   },

   draw: function({ cs }) {
      cs.draw.circle({
         x: this.pos.x,
         y: this.pos.y,
         radius: this.radius
      })
   }
}
