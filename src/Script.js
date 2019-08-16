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
         this.mapScripts('', this.cs.scripts, undefined)
      }

      mapScripts(path, object, parent) {
         for (let scriptName in object) {
            // keep base parent this scope through scripts (allows nesting)
            let thisParent = parent ? parent : object[scriptName]
            let script = object[scriptName]

            this.map[path + scriptName] = {
               function: script,
               parent: thisParent
            }

            this.mapScripts(scriptName + '.', this.cs.scripts[scriptName], thisParent)
         }
      }

      exec(scriptName, options) {
         if (options == null) options = {}
         options.cs = this.cs

         const script = this.map[scriptName]
         if (!script) return console.log('COULD NOT FIND SCRIPT: ' + scriptName)
         return script.function.call(script.parent, options)
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_SCRIPT
      : cs.script = new CSENGINE_SCRIPT(cs)
})()
