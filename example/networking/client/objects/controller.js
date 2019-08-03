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
         cs.global.selfObject.keys = this.oldKeys
         cs.script.network.send({
            func: 'keyboard',
            data: keys
         })
      }
   },
}
