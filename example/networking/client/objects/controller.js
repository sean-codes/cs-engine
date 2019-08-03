cs.objects.controller = {
   surface: 'gui',
   create: function() {
      this.oldKeys = { up: false, down: false, left: false, right: false }

      this.touch = cs.inputTouch.observer()
      this.joyPos = { x: 0, y: 0 }
      this.joySize = 75
      this.xFromCenter = 0
      this.yFromCenter = 0
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

         if (Math.abs(xFromCenter) > this.joySize/2) {
            var downKey = Math.sign(xFromCenter) > 0 ? 'arrow-right' : 'arrow-left'
            var upKey = Math.sign(xFromCenter) > 0 ? 'arrow-left' : 'arrow-right'
            cs.inputKeyboard.virtualDown(cs.global.keymap[downKey])
            cs.inputKeyboard.virtualUp(cs.global.keymap[upKey])
         } else {
            cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-left'])
            cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-right'])
         }

         if (Math.abs(yFromCenter) > this.joySize/2) {
            var downKey = Math.sign(yFromCenter) > 0 ? 'arrow-down' : 'arrow-up'
            var upKey = Math.sign(yFromCenter) > 0 ? 'arrow-up' : 'arrow-down'
            cs.inputKeyboard.virtualDown(cs.global.keymap[downKey])
            cs.inputKeyboard.virtualUp(cs.global.keymap[upKey])
         } else {
            cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-up'])
            cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-down'])
         }
      } else {
         this.xFromCenter = 0
         this.yFromCenter = 0
         cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-left'])
         cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-right'])
         cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-up'])
         cs.inputKeyboard.virtualUp(cs.global.keymap['arrow-down'])
      }



      var keys = {
         up: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-up']),
         down: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-down']),
         left: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-left']),
         right: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-right']),
      }

      if (
         this.oldKeys.up !== keys.up ||
         this.oldKeys.down !== keys.down ||
         this.oldKeys.right !== keys.right ||
         this.oldKeys.left !== keys.left
      ) {
         this.oldKeys = cs.clone(keys)
         cs.global.selfObject.keys = this.oldKeys
         cs.script.network.send({
            func: 'keyboard',
            data: keys
         })
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


      // debug info
      cs.draw.setColor('#FFF')
      cs.draw.text({
         x: 10,
         y: 10,
         text: cs.global.ping + 'ms'
      })

      cs.draw.setColor('#FFF')
      cs.draw.text({
         x: 10,
         y: 20,
         text: Math.round(cs.network.metrics.downAverage / 1000) + 'kb'
      })
   }
}
