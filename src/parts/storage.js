//----------------------------------------------------------------------------//
//----------------------------------| Storage Functions |---------------------//
//----------------------------------------------------------------------------//
cs.storage = {
   data: {},

   init: function() {
      for (var storage of cs.storages) {
         this.write(storage)
      }
   },

   read: function(location) {
      return JSON.parse(this.data[location])
   },

   write: function(options) {
      this.data[options.location] = JSON.stringify(options.data)
      if (options.save) this.save(options.location)
   },

   // reminds me of bash ls command
   ls: function(location) {
      var startsWith = cs.default(location, '')
      var list = []
      for (var storageName of Object.keys(this.data)) {
         if (storageName.startsWith(startsWith)) {
            list.push(storageName)
         }
      }
      return list
   },

   save: function(location) {
      // local storage
      window.localStorage.setItem(location, this.data[location])
   },

   reset: function() {

   }
}
