cs.scripts.networkFunctions = {
   'connect': function(data) {
      console.log('connected', data)
      cs.global.self = data.gameObjectId
   },

   'snapshot': function(data) {
      cs.global.ping = data.ping
      cs.scripts.network.send({
         func: 'ping',
         data: data.sent
      })

      var snapshot = data.snapshot

      for (var object of cs.object.every()) {
         if (object.networkId == null) continue
         if (object.networkId == cs.global.self) cs.global.selfObject = object

         var update = snapshot.find(n => n.id === object.networkId)
         if (update) {
            update.used = true
            object.read(update)
         } else {
            cs.object.destroy(object)
         }
      }

      for (var objectSnapshot of snapshot) {
         if (!objectSnapshot.used) {
            cs.object.create({
               type: objectSnapshot.type,
               attr: { snapshot: objectSnapshot }
            })
         }
      }
   }
}
