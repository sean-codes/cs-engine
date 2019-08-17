// -------------------------------------------------------------------------- //
// ----------------------------| CS ENGINE: STORAGE |------------------------ //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_STORAGE {
      constructor(cs) {
         this.cs = cs
         this.data = {}
      }

      init() {
         for (const storage of this.cs.storages) {
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
         const startsWith = this.cs.default(location, '')
         const list = []
         for (const storageName of Object.keys(this.data)) {
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

   if (typeof module !== 'undefined') module.exports = CSENGINE_STORAGE
   else cs.storage = new CSENGINE_STORAGE(cs) // eslint-disable-line no-undef
})()
