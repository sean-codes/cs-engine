module.exports = {
   objectMap: {},

   sendSocketNetworkObjects: function (socket) {
      const { cs } = this

      for (const objectId in this.objectMap) {
         const object = this.objectMap[objectId]
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

   objectCreate: function (object) {
      const { cs } = this
      this.objectMap[object.core.id] = object
      cs.script.network.broadcast({
         func: 'object-create',
         data: {
            type: object.core.type,
            id: object.core.id,
            share: object.share({ cs })
         }
      })
   },

   objectDestroy: function (object) {
      const { cs } = this
      cs.script.network.broadcast({
         func: 'object-destroy',
         data: { id: object.core.id }
      })

      delete this.objectMap[object.core.id]
   },

   snapshot: function () {
      const { cs } = this
      const snapshot = []
      for (const object of cs.object.every()) {
         if (object.snapshotWrite) {
            snapshot.push({
               i: object.core.id,
               s: [...object.snapshotWrite({ cs })]
            })
         }
      }

      cs.script.network.broadcast({
         func: 'snapshot',
         data: snapshot
      })
   }
}
