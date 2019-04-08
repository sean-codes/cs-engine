cs.objects.controller = {
   surface: 'gui',
   create: function() {
      this.margin = 20
      this.buttonSize = 60
      this.touchLeftRight = cs.touch.observer()
      this.touchForward = cs.touch.observer()
      this.touchFire = cs.touch.observer()
   },

   step: function() {
      this.rectLeftButton = {
         x: this.margin,
         y: cs.draw.surface.height - this.margin - this.buttonSize,
         size: this.buttonSize
      }

      this.rectRightButton = {
         x: this.margin * 2 + this.buttonSize,
         y : this.rectLeftButton.y,
         size: this.buttonSize
      }

      this.rectForwardButton = {
         x: cs.draw.surface.width - this.margin - this.buttonSize,
         y : this.rectLeftButton.y,
         size: this.buttonSize
      }

      this.rectFireButton = {
         x: cs.draw.surface.width - this.margin*2 - this.buttonSize*2,
         y : this.rectLeftButton.y,
         size: this.buttonSize
      }

      this.rectLeftRightButtons = {
         x: this.margin,
         y: this.rectLeftButton.y,
         width: this.rectRightButton.x + this.buttonSize - this.rectLeftButton.x,
         height: this.buttonSize
      }

      this.touchLeftRight.check(this.rectLeftRightButtons)

      if (this.touchLeftRight.isHeld()) {
         var withinLeft = this.touchLeftRight.isWithin(this.rectLeftButton)
         var withinRight = this.touchLeftRight.isWithin(this.rectRightButton)

         if (withinLeft) {
            cs.key.virtualDown(37)
            cs.key.virtualUp(39)
         }

         if (withinRight) {
            cs.key.virtualDown(39)
            cs.key.virtualUp(37)
         }

         if (!withinLeft && !withinRight) {
            cs.key.virtualUp(37)
            cs.key.virtualUp(39)
         }
      } else {
         if (this.touchLeftRight.isUp()) {
            cs.key.virtualUp(37)
            cs.key.virtualUp(39)
         }
      }

      this.touchForward.check(this.rectForwardButton)
      if (this.touchForward.isHeld()) {
         cs.key.virtualDown(38)
      } else {
         if (this.touchForward.isUp()) {
            cs.key.virtualUp(38)
         }
      }

      this.touchFire.check(this.rectFireButton)
      if (this.touchFire.isHeld()) {
         cs.key.virtualDown(32)
      } else {
         if (this.touchFire.isUp()) {
            cs.key.virtualUp(32)
         }
      }
   },

   draw: function() {
      // left button
      cs.draw.setAlpha(0.5)
      cs.draw.fillRect({
         x: this.rectLeftButton.x,
         y: this.rectLeftButton.y,
         size: this.rectLeftButton.size
      })

      cs.draw.setColor('#FFF')
      cs.draw.setWidth(4)
      cs.draw.strokeRect({
         x: this.rectLeftButton.x,
         y: this.rectLeftButton.y,
         size: this.rectLeftButton.size
      })

      cs.draw.sprite({
         spr: 'icon_arrow',
         x: this.rectLeftButton.x + this.rectLeftButton.size/2,
         y: this.rectLeftButton.y + this.rectLeftButton.size/2,
         size: this.rectLeftButton.size,
         center: true,
         angle: -90
      })

      // right button
      cs.draw.setAlpha(0.5)
      cs.draw.fillRect({
         x: this.rectRightButton.x,
         y: this.rectRightButton.y,
         size: this.rectRightButton.size
      })

      cs.draw.setColor('#FFF')
      cs.draw.setWidth(4)
      cs.draw.strokeRect({
         x: this.rectRightButton.x,
         y: this.rectRightButton.y,
         size: this.rectRightButton.size
      })

      cs.draw.sprite({
         spr: 'icon_arrow',
         x: this.rectRightButton.x + this.rectRightButton.size/2,
         y: this.rectRightButton.y + this.rectRightButton.size/2,
         size: this.rectRightButton.size,
         center: true,
         angle: 90
      })


      // forward
      cs.draw.setAlpha(0.5)
      cs.draw.fillRect({
         x: this.rectForwardButton.x,
         y: this.rectForwardButton.y,
         size: this.rectForwardButton.size
      })

      cs.draw.setColor('#FFF')
      cs.draw.setWidth(4)
      cs.draw.strokeRect({
         x: this.rectForwardButton.x,
         y: this.rectForwardButton.y,
         size: this.rectForwardButton.size
      })

      cs.draw.sprite({
         spr: 'icon_arrow',
         x: this.rectForwardButton.x + this.rectForwardButton.size/2,
         y: this.rectForwardButton.y + this.rectForwardButton.size/2,
         size: this.rectForwardButton.size,
         center: true,
         angle: 0
      })

      // fire
      cs.draw.setAlpha(0.5)
      cs.draw.fillRect({
         x: this.rectFireButton.x,
         y: this.rectFireButton.y,
         size: this.rectFireButton.size
      })

      cs.draw.setColor('#FFF')
      cs.draw.setWidth(4)
      cs.draw.strokeRect({
         x: this.rectFireButton.x,
         y: this.rectFireButton.y,
         size: this.rectFireButton.size
      })

      cs.draw.sprite({
         spr: 'icon_shoot',
         x: this.rectFireButton.x + this.rectFireButton.size/2,
         y: this.rectFireButton.y + this.rectFireButton.size/2,
         size: this.rectFireButton.size,
         center: true,
         angle: 0
      })
   }
}
