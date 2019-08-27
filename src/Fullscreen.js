// -------------------------------------------------------------------------- //
// -------------------------| CS ENGINE: FULLSCREEN |------------------------ //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_FULLSCREEN {
      constructor(cs) {
         this.cs = cs
      }

      possible() {
         return this.normalize('possible')
      }

      is() {
         return this.normalize('element')
      }

      toggle() {
         if (this.possible()) {
            if (this.normalize('element')) this.exit()
            else this.enter()
         }
      }

      enter() {
         if (this.possible()) this.normalize('request')
      }

      exit() {
         if (this.possible() && this.is()) this.normalize('exit')
      }

      normalize(func) {
         if (!document.hasFocus) return false

         for (const prefix of [undefined, 'moz', 'webkit']) {
            let requestFullscreen = prefix + 'RequestFullscreen'
            let fullscreenElement = prefix + 'FullscreenElement'
            let fullscreenEnabled = prefix + 'FullscreenEnabled'
            let exitFullscreen = prefix + 'ExitFullscreen'

            if (!prefix) {
               requestFullscreen = 'requestFullscreen'
               fullscreenElement = 'fullscreenElement'
               fullscreenEnabled = 'fullscreenEnabled'
               exitFullscreen = 'exitFullscreen'
            }

            if (document.documentElement[requestFullscreen] !== undefined) {
               if (func === 'possible') return document.documentElement[requestFullscreen]
               else if (func === 'element') return document[fullscreenElement]
               else if (func === 'exit') return document[exitFullscreen]()
               else if (func === 'request') return document.documentElement[requestFullscreen]()
               else if (func === 'enabled') return document[fullscreenEnabled]
            }
         }

         return false
      }
   }

   // export (node / web)
   if (typeof cs === 'undefined') module.exports = CSENGINE_FULLSCREEN
   else cs.fullscreen = new CSENGINE_FULLSCREEN(cs) // eslint-disable-line no-undef
})()
