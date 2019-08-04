cs.objects.controller = {
   surface: 'gui',
   create: function() {
      this.oldForward = false
      this.oldAngle = 0
      this.angle = 0
      this.forward = false
   },

   step: function() {
      var keys = {
         up: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-up']),
         down: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-down']),
         left: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-left']),
         right: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-right']),
      }


      if (keys.left) this.angle -= 4
      if (keys.right) this.angle += 4
      this.forward = keys.up

      var joystick = cs.object.find('joystick')
      if (joystick) {
         var angleToAngle = cs.math.angleToAngle(this.angle, joystick.angle)

         if (Math.abs(angleToAngle) < 5) {
            this.angle = joystick.angle
         } else {
            this.angle += Math.sign(angleToAngle) * 4
         }

         this.forward = joystick.forward
      }

      if (
         this.oldForward !== this.forward ||
         this.oldAngle !== this.angle
      ) {
         // update old
         this.oldForward = this.forward
         this.oldAngle = this.angle

         // apply to self
         cs.global.selfObject.controlForward = this.oldForward
         cs.global.selfObject.controlAngle = this.oldAngle

         // send to network
         cs.script.network.send({
            func: 'control',
            data: {
               forward: this.oldForward,
               angle: this.oldAngle
            }
         })
      }
   },
}
