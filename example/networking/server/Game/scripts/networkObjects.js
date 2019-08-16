module.exports = {
   objectMap: {},

   sendSocketNetworkObjects: function({ cs, socket }) {
      for (var objectId in this.objectMap) {
         var object= this.objectMap[objectId]
         socket.send({
            func: 'object-create',
            data: {
               type: object.core.type,
               id: object.core.id,
               share: object.share({ cs })
            }
         })
      }
   },

   objectCreate: function({ cs, object }) {
      this.objectMap[object.core.id] = object
      cs.script.exec('network.broadcast', { message: {
         func: 'object-create',
         data: {
            type: object.core.type,
            id: object.core.id,
            share: object.share({ cs })
         }
      }})
   },

   objectDestroy: function({ cs, object }) {
      cs.script.exec('network.broadcast', { message: {
         func: 'object-destroy',
         data: { id: object.core.id }
      }})

      delete this.objectMap[object.core.id]
   },

   snapshot: function({ cs }) {
      let snapshot = []
      for (let object of cs.object.every()) {
         if (object.snapshotWrite) {
            snapshot.push({
               type: object.core.type,
               id: object.core.id,
               ...object.snapshotWrite({ cs })
            })
         }
      }

      cs.script.exec('network.broadcast', { message: {
         func: 'snapshot',
         data: snapshot
      }})
   }
}
