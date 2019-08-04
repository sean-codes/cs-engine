//----------------------------------------------------------------------------//
//-----------------------------| CS ENGINE: STORAGE |-------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_STORAGE {
      constructor(cs) {
         this.cs = cs

         this.data = {}
      }

      init() {
         for (var storage of this.cs.storages) {
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

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_STORAGE
      : cs.storage = new CSENGINE_STORAGE(cs)
})()
