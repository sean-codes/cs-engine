cs.objects.player = {
   create: function() {
      this.x = cs.default(this.x, 0)
      this.y = cs.default(this.y, 0)
      this.radius = 5
   },

   step: function() {

   },

   draw: function() {
      cs.draw.setColorFill("#333")
      cs.draw.setColorStroke("#49f")

      cs.draw.circle({
         x: this.x,
         y: this.y,
         radius: this.radius,
         fill: true,
         stroke: true
      })
   }
}
