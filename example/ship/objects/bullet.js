cs.objects.bullet = {
   create: function() {
      this.spriteInfo = cs.sprite.info({ spr: 'bullet' })
      this.x -= this.spriteInfo.width /2
   },

   step: function() {
      this.y -= 1
   },

   draw: function() {
      cs.draw.sprite({
         spr: this.spriteInfo.name,
         x: this.x,
         y: this.y
      })
   }
}
