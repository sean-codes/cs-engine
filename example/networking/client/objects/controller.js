/* global cs */

cs.objects.controller = {
   surface: 'gui',
   create: function() {
      this.oldFire = false
      this.oldForward = false
      this.oldAngle = 0
      this.angle = 0
      this.forward = false
      this.keys = {}
      this.turning = false
   },

   step: function() {
      if (!cs.global.selfObject) return

      this.keys = {
         up: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-up']),
         down: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-down']),
         left: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-left']),
         right: cs.inputKeyboard.isHeld(cs.global.keymap['arrow-right']),
         space: cs.inputKeyboard.isHeld(cs.global.keymap['spacebar'])
      }

      this.fire = this.keys.space

      if (this.keys.left) this.angle -= 5
      if (this.keys.right) this.angle += 5
      this.forward = this.keys.up

      var joystick = cs.object.find('joystick')
      if (joystick) {
         this.angle = joystick.angle
         this.forward = joystick.forward
      }

      this.turning = this.angle !== this.oldAngle

      if (
         this.oldFire !== this.fire ||
         this.oldForward !== this.forward ||
         this.oldAngle !== this.angle
      ) {
         // update old
         this.oldFire = this.fire
         this.oldForward = this.forward
         this.oldAngle = this.angle

         // apply to self
         cs.global.selfObject.controlForward = this.oldForward
         cs.global.selfObject.controlAngle = this.oldAngle

         // send to network
         cs.scripts.network.send({
            func: 'game',
            data: {
               func: 'control',
               data: {
                  fire: this.oldFire,
                  forward: this.oldForward,
                  angle: this.oldAngle
               }
            }
         })
      }
   },
}
