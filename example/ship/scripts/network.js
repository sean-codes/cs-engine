cs.script.network = {
   onConnect: function() {
      console.log('connected')
   },

   onDisconnect: function() {
      console.log('disconnected')
   },

   onMessage: function(jsonString) {
      cs.global.debug && console.log('message', jsonString)
      try {
         var message = JSON.parse(jsonString)
         cs.script.network.messageFuncs[message.func](message.data)
      } catch(e) {
         console.log('could not parse message', e)
      }
   },

   send: function(data) {
      cs.network.send(data)
   },

   messageFuncs: {
      id: function(data) {
         cs.global.id = data.id
      },

      newShip: function(data) {
         cs.object.create({
            type: 'ship',
            attr: {
               id: data.id,
               name: data.name,
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

      bullet: function(data) {
         cs.object.create({
            type: 'bullet',
            attr: {
               x: data.x,
               y: data.y,
               direction: data.direction,
               id: data.id
            }
         })
      },

      destroyBullet: function(data) {
         var destroyID = data.id
         var destroyBullet = cs.object.search(function(bullet) {
            return bullet.id == destroyID
         })
         if (destroyBullet) cs.object.destroy(destroyBullet)
      },

      change: function(data) {
         var shipId = data.id
         var ship = cs.object.search(function(ship) {
            return ship.id == shipId
         })


         if (ship) {
            if (ship.id == cs.global.id) return

            ship.name = data.name
            ship.keys = data.keys
            ship.x = data.x
            ship.y = data.y
            ship.xSpeed = data.xSpeed
            ship.ySpeed = data.ySpeed
            ship.turnSpeed = data.turnSpeed
            ship.direction = data.direction
         }
      },

      hitShip: function(data) {
         var shipId = data.id

         var ship = cs.object.search(function(ship) {
            return ship.id == shipId
         })

         if (ship) {
            ship.respawning = true
            cs.object.create({
               type: 'explode',
               attr: {
                  x: ship.x,
                  y: ship.y
               }
            })
         }

         if (shipId == cs.global.id) {
            cs.global.respawning = true
            cs.global.respawnTime = data.respawnTime
         }
      },

      respawn: function(data) {
         var shipId = data.id
         var x = data.x
         var y = data.y

         var ship = cs.object.search(function(ship) {
            return ship.id == shipId
         })

         if (ship) {
            ship.x = x
            ship.y = y
            ship.respawning = false
         }

         if (shipId == cs.global.id) {
            cs.global.respawning = false
            cs.global.respawnTime = 0
         }
      },

      scoreboard: function(data) {
         cs.global.timeLeft = data.timeLeft || 0
         cs.global.score = data.score || []
         console.log('score', data)
      },

      gamestate: function(data) {
         cs.global.timeLeft = data.timeLeft
         cs.global.timeNewGame = data.timeNewGame
         cs.global.score = data.score || []
      }
   }
}
