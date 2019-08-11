module.exports = function({ cs }) {
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

   return snapshot
}
