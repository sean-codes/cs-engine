cs.objects.joystick = {
   surface: 'gui',
   create: function() {
      this.touch = cs.inputTouch.observer()
      this.joyPos = { x: 0, y: 0 }
      this.joySize = 75
      this.xFromCenter = 0
      this.yFromCenter = 0
      this.angle = 0
      this.forward = false
   },

   step: function() {
      // touch joystick
      var guiSurface = cs.surface.list['gui']
      this.joyPos = {
         x: 100,
         y: guiSurface.height - 100
      }

      var touchArea = {
         x: this.joyPos.x - this.joySize,
         y: this.joyPos.y - this.joySize,
         size: this.joySize*2
      }

      this.touch.check(touchArea)
      if (this.touch.isHeld()) {
         var xFromCenter =  this.touch.x - (touchArea.x + touchArea.size/2)
         var yFromCenter =  this.touch.y - (touchArea.y + touchArea.size/2)
         this.xFromCenter = Math.min(this.joySize, Math.max(xFromCenter, -this.joySize))
         this.yFromCenter = Math.min(this.joySize, Math.max(yFromCenter, -this.joySize))
         var distanceFromCenter = cs.vector.length({ x: xFromCenter, y: yFromCenter })


         this.forward = distanceFromCenter > this.joySize / 2
         this.angle = cs.math.angleXY(xFromCenter, yFromCenter)
      } else {
         this.forward = false
         this.xFromCenter = 0
         this.yFromCenter = 0
         cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-left'])
         cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-right'])
         cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-up'])
         cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-down'])
      }
   },

   draw: function() {
      // draw joystick
      cs.draw.setWidth(5)
      cs.draw.setColor('rgba(255, 255, 255, 0.75)')
      cs.draw.circle({
         x: this.joyPos.x,
         y: this.joyPos.y,
         radius: this.joySize
      })

      cs.draw.setColor('rgba(255, 255, 255, 0.75)')
      cs.draw.circle({
         x: this.joyPos.x + this.xFromCenter,
         y: this.joyPos.y + this.yFromCenter,
         radius: this.joySize/2,
         fill: true
      })
   }
}
