cs.objects.background = {
   create: function() {
      this.core.surface = 'background'

      this.hasDrawn = false

      this.sprite = 'background'
      this.spriteInfo = cs.sprite.info({ spr: this.sprite })
   },

   draw: function() {
      if (!this.hasDrawn) {
         this.hasDrawn = true

         var x = 0
         var y = 0
         while (x < cs.room.width) {
            while( y < cs.room.height) {
               cs.draw.sprite({
                  x: x,
                  y: y,
                  spr: this.sprite
               })
               y += this.spriteInfo.height
            }
            x += this.spriteInfo.width

            y = 0
         }
      }
   }
}
