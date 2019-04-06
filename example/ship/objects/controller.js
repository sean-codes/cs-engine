cs.objects.controller = {
   create: function() {
      this.keys = { left: false, right: false, forward: false }
      this.sentKeys = { left: false, right: false, forward: false }
   },

   step: function() {
      var keys = {
         left: cs.key.isHeld(39),
         right: cs.key.isHeld(37),
         forward: cs.key.isHeld(38)
      }

      if (
         keys.left != this.sentKeys.left
         || keys.right != this.sentKeys.right
         || keys.forward != this.sentKeys.forward
      ) {
         this.sentKeys.left = keys.left
         this.sentKeys.right = keys.right
         this.sentKeys.forward = keys.forward

         cs.script.network.send({
            keys: keys
         })
      }
   }
}
