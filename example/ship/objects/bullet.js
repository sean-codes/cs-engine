cs.objects.bullet = {
   create: function() {
      this.spriteInfo = cs.sprite.info({ spr: 'bullet' })
      this.direction = cs.default(this.direction, 0)
      this.speed = 3
   },

   step: function() {
      this.x += cs.math.cos(this.direction) * this.speed
      this.y += cs.math.sin(this.direction) * this.speed
   },

   draw: function() {
      cs.draw.sprite({
         spr: this.spriteInfo.name,
         x: this.x,
         y: this.y,
         angle: this.direction,
         center: true
      })
   }
}
