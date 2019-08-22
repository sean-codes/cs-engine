// -------------------------------------------------------------------------- //
// ----------------------------| CS ENGINE: SCRIPTS |------------------------ //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_SCRIPTS {
      constructor(cs) {
         this.cs = cs
      }

      init() {
         for (const scriptName in this.cs.script) {
            this.add(scriptName, this.cs.script[scriptName])
         }
         
         this.cs.script.cs = this.cs
      }

      add(scriptName, object) {
         this.cs.script[scriptName] = object
         this.applyCsToScope('', object, object)
      }

      applyCsToScope(path, object, parent) {
         if (typeof object !== 'object' || Array.isArray(object)) return

         for (const scriptName in object) {
            // keep base parent this scope through scripts (allows nesting)
            if (scriptName === 'cs') continue

            parent.cs = this.cs
            if (typeof object[scriptName] === 'function') {
               object[scriptName] = object[scriptName].bind(parent)
            }

            this.applyCsToScope(scriptName + '.', object[scriptName], parent)
         }
      }
   }

   // export (node / web)
   if (typeof module !== 'undefined') module.exports = CSENGINE_SCRIPTS
   else cs.scripts = new CSENGINE_SCRIPTS(cs) // eslint-disable-line no-undef
})()
