/* global cs */

cs.scripts.networkObjects = {
   objectMap: {},

   objectCreate: function(data) {
      this.objectMap[data.id] = cs.object.create({
         type: data.type,
         attr: {
            networkId: data.id,
            share: data.share
         }
      })
   },

   objectDestroy: function(data) {
      var object = this.objectMap[data.id]
      if (object) {
         cs.object.destroy(object)
         delete this.objectMap[data.id]
      }
   },

   objectChange: function(data) {
      var object = this.objectMap[data.id]
      if (object) {
         for (var attrName in data.attr) {
            object[attrName] = data.attr[attrName]
         }
      }
   },

   objectSnapshots: function(snapshots) {
      cs.global.snapshotInterval = cs.math.round(1000 / (Date.now() - cs.global.snapshotLast))
      cs.global.snapshotLast = Date.now()

      for (var snap of snapshots) {
         var object = this.objectMap[snap[0]]
         if (object) {
            object.snapshotRead(snap)
         }
      }
   }
}
