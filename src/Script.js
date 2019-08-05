//----------------------------------------------------------------------------//
//------------------------------| CS ENGINE: SETUP |--------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_SCRIPT {
      constructor(cs) {
         this.cs = cs

         this.map = {}
      }

      init() {
         this.mapScripts('', this.cs.scripts)
      }

      mapScripts(path, object) {
         for (let scriptName in object) {
            let script = object[scriptName]
            this.map[path + scriptName] = script
            this.mapScripts(scriptName + '.', this.cs.scripts[scriptName])
         }
      }

      exec(scriptName, options) {
         if (options == null) options = {}
         options.cs = this.cs
         return this.map[scriptName](options)
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_SCRIPT
      : cs.script = new CSENGINE_SCRIPT(cs)
})()
