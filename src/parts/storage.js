//----------------------------------------------------------------------------//
//----------------------------------| Storage Functions |---------------------//
//----------------------------------------------------------------------------//
class CSENGINE_STORAGE {
   constructor(cs) {
      this.cs = cs

      this.loaded = []
      this.data = {}
   }

   init() {
      for (var storage of this.loaded) {
         this.write(storage)
      }
   }

   read(location) {
      return JSON.parse(this.data[location])
   }

   write(options) {
      this.data[options.location] = JSON.stringify(options.data)
      if (options.save) this.save(options.location)
   }

   // reminds me of bash ls command
   ls(location) {
      var startsWith = cs.default(location, '')
      var list = []
      for (var storageName of Object.keys(this.data)) {
         if (storageName.startsWith(startsWith)) {
            list.push(storageName)
         }
      }
      return list
   }

   save(location) {
      // local storage
      window.localStorage.setItem(location, this.data[location])
   }

   reset() {

   }
}

if (module) module.exports = CSENGINE_STORAGE
