cs.script.network = {
   onConnect: function() {
      console.log('connected')
   },

   onDisconnect: function() {
      console.log('disconnected')
   },

   onMessage: function(jsonString) {
      console.log('message', jsonString)
      try {
         var message = JSON.parse(jsonString)
         cs.script.network.messageFuncs[message.func](message.data)
      } catch(e) {
         console.log('could not parse message')
      }
   },

   send: function(data) {
      cs.network.send(data)
   },

   messageFuncs: {
      id: function(data) {
         console.log('setting id', data.id)
         cs.global.id = data.id
      },

      newShip: function(data) {
         cs.object.create({
            type: 'ship',
            attr: {
               id: data.id,
               x: data.x,
               y: data.y,
               direction: data.direction
            }
         })
      },

      destroyShip: function(data) {
         var destroyID = data.id
         var destroyShip = cs.object.search(function(ship) {
            return ship.id == destroyID
         })

         if (destroyShip) cs.object.destroy(destroyShip)
      },

      change: function(data) {
         for (var ship of data.ships) {
            // console.log({
            //    shipID: ship.id,
            //    keys: ship.keys
            // })

            for (var shipObject of cs.object.all('ship')) {
               if (shipObject.id == ship.id) {
                  // var delay = Date.now() - dealy

                  shipObject.keys = ship.keys
                  shipObject.xFix = shipObject.x - ship.x
                  shipObject.yFix = shipObject.y - ship.y
                  shipObject.xSpeed = ship.xSpeed
                  shipObject.ySpeed = ship.ySpeed
                  shipObject.turnSpeed = ship.turnSpeed
                  shipObject.direction = ship.direction
                  // console.log(shipObject.xFix, shipObject.yFix)
               }
            }
         }
      }
   }
}
