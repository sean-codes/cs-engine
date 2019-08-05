module.exports = function({ cs }) {
   let snapshot = []
   for (let object of cs.object.every()) {
      if (object.share) {
         snapshot.push({
            type: object.core.type,
            id: object.core.id,
            ...object.share({ cs })
         })
      }
   }

   return snapshot
}
