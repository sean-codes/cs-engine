cs.script.networkFunctions = {
   'connect': function(data) {
      console.log('connected', data)
      cs.global.self = data.gameObjectId
   },

   'state': function(data) {
      var networkObjects = data.objects
      cs.global.ping = data.ping
      var sent = data.sent

      cs.script.network.send({
         func: 'ping',
         data: data.sent
      })

      for (var object of cs.object.every()) {
         if (object.networkId == null) continue

         var update = networkObjects.find(n => n.attr.id === object.networkId)
         if (update) {
            var fix = (cs.global.ping/2) / cs.loop.speed

            var predictXBackward = !update.attr.speedX && object.speedX
            var predictX = predictXBackward
               ? fix * -object.speedX
               : fix * update.attr.speedX

            var predictYBackward = !update.attr.speedY && object.speedY
            var predictY = predictXBackward
               ? fix * -object.speedY
               : fix * update.attr.speedY


            update.used = true
            object.nx = object.x - (update.attr.x + (predictX))
            object.ny = object.y - (update.attr.y + (predictY))
            object.speedX = update.attr.speedX
            object.speedY = update.attr.speedY

         } else {
            cs.object.destroy(object)
         }
      }

      for (var object of networkObjects) {
         if (!object.used) cs.object.create({
            type: object.type,
            attr: object.attr
         })
      }
   }
}