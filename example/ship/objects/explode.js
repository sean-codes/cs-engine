cs.objects.explode = {
   zIndex: 5,
   create: function() {
      this.x = cs.default(this.x, 0)
      this.y = cs.default(this.y, 0)

      this.explodes = []
      this.start = 3
      this.life = 60
   },

   draw: function() {
      for (var i = this.explodes.length-1; i >= 0; i--) {
         explode = this.explodes[i]

         explode.alpha -= 0.05
         if (explode.alpha > 0) {
            explode.x += explode.xSpeed
            explode.y += explode.ySpeed

            cs.draw.setAlpha(explode.alpha)
            cs.draw.sprite({
               spr: 'explode',
               x: explode.x,
               y: explode.y,
               center: true,

               size: explode.size
            })
         }
      }

      if (Math.random() > 0.95 || this.start > 0) {
         this.start -= 1
         this.explodes.push({
            x: this.x + (Math.random() * 10 - 5),
            y: this.y + (Math.random() * 10 - 5),
            xSpeed: Math.random() * 0.5 - 0.25,
            ySpeed: Math.random() * 0.5 - 0.25,
            size: Math.random() * 10 + 10,
            alpha: 1
         })
      }

      this.life -= 1
      !this.life && cs.object.destroy(this)
   }
}
