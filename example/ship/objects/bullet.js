cs.objects.bullet = {
   zIndex: 1,
   create: function() {
      this.x = cs.default(this.x, 0)
      this.y = cs.default(this.y, 0)
      this.direction = cs.default(this.direction, 0)
      this.speed = 3
   },

   step: function() {
      this.x += cs.math.cos(this.direction) * this.speed
      this.y += cs.math.sin(this.direction) * this.speed
   },

   draw: function() {
      cs.draw.sprite({
         spr: 'bullet',
         x: this.x,
         y: this.y,
         angle: this.direction,
         center: true
      })
   }
}
