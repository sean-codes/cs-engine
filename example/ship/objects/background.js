cs.objects.background = {
   create: function() {
      this.core.surface = 'background'

      this.hasDrawn = false

      this.sprite = 'background'
      this.spriteInfo = cs.sprite.info({ spr: this.sprite })
   },
   drawOnce: function() {
      var x = 0
      var y = 0
      while (x < cs.room.width) {
         while( y < cs.room.height) {
            var frameID = cs.math.iRandomRange(0, this.spriteInfo.frames.length - 1)
            cs.draw.sprite({
               x: x,
               y: y,
               spr: this.sprite,
               frame: frameID
            })
            y += this.spriteInfo.height
         }
         x += this.spriteInfo.width

         y = 0
      }
   }
}
