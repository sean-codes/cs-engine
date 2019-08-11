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
            this.map[path + scriptName] = {
               function: script,
               parent: object
            }

            this.mapScripts(scriptName + '.', this.cs.scripts[scriptName])
         }
      }

      exec(scriptName, options) {
         if (options == null) options = {}
         options.cs = this.cs

         const script = this.map[scriptName]
         return script.function.call(script.parent, options)
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_SCRIPT
      : cs.script = new CSENGINE_SCRIPT(cs)
})()
