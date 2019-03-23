cs.script.network = {
   receivedMessage: function(message) {
      var network = cs.global.networkControl;
      var message = JSON.parse(message);

      switch (message.type) {
         case 'connect':
            console.log('Connected ID: ' + message.id);
            network.id = message.id;
            cs.network.send({ type: 'connect', x: network.x, y: network.y });
            break;

         case 'newPlayers':
            console.log(message);
            message.list.forEach(function(player) {
               var newPlayer = cs.object.create({
                  type: 'obj_otherplayer',
                  attr: {
                     x: player.x,
                     y: player.y
                  }
               })

               cs.global.networkControl.list[player.id] = {
                  id: player.id,
                  obj: newPlayer
               }
            })
            break

         case 'endPlayers':
            message.list.forEach(function(player) {
               console.log(player);
               var networkPlayer = cs.global.networkControl.list[player.id]
               console.log(networkPlayer)
               cs.object.destroy(cs.global.networkControl.list[player.id].obj)
            })
            break

         case 'movement':
            var obj = cs.global.networkControl.list[message.id].obj;
            obj.keys = message.keys;
            obj.x = message.x;
            obj.y = message.y;
            obj.hspeed = message.hspeed;
            obj.vspeed = message.vspeed;
            break
      }
   },

   sendMovement: function(obj) {
      if (!cs.network.status) return

      cs.network.send({
         type: 'movement',
         keys: obj.old_keys,
         x: obj.x,
         y: obj.y,
         hspeed: obj.hspeed,
         vspeed: obj.vspeed
      })
   },
}
