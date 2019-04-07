cs.objects.controller = {
   create: function() {
      this.keys = { left: false, right: false, forward: false, shoot: false }
      this.sentKeys = { left: false, right: false, forward: false, shoot: false }
   },

   step: function() {
      var keys = {
         left: cs.key.isHeld(39),
         right: cs.key.isHeld(37),
         forward: cs.key.isHeld(38),
         shoot: cs.key.isHeld(32)
      }

      if (
         keys.left != this.sentKeys.left
         || keys.right != this.sentKeys.right
         || keys.forward != this.sentKeys.forward
         || keys.shoot != this.sentKeys.shoot
      ) {
         this.sentKeys.left = keys.left
         this.sentKeys.right = keys.right
         this.sentKeys.forward = keys.forward
         this.sentKeys.shoot = keys.shoot

         cs.global.keys = this.sentKeys
         var ship = cs.object.search(function(ship) {
            return ship.id == cs.global.id
         })

         cs.script.network.send({
            func: 'control',
            data: {
               keys: keys,
               x: ship.x,
               y: ship.y,
               xSpeed: ship.xSpeed,
               ySpeed: ship.ySpeed,
               direction: ship.direction,
               turnSpeed: ship.turnSpeed,
            }
         })
      }
   }
}
