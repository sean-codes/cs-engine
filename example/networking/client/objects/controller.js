cs.objects.controller = {
   surface: 'gui',
   create: function() {
      this.oldKeys = { up: false, down: false, left: false, right: false }
   },

   step: function() {
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
         cs.script.network.send({
            func: 'keyboard',
            data: keys
         })
      }
   },

   draw: function() {
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
