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
         if (object.networkId == cs.global.self) cs.global.selfObject = object

         var update = networkObjects.find(n => n.attr.id === object.networkId)
         if (update) {
            update.used = true
            object.posFix = cs.vector.min(update.attr.pos, object.pos)
            object.speed = update.attr.speed
            object.turnSpeed = update.attr.turnSpeed
            object.angle = update.attr.angle

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
