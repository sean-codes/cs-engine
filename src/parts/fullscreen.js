class CSENGINE_FULLSCREEN {
   constructor(cs) {
      this.cs = cs
   }

   possible() {
      return this.normalize('possible')
   }

   is() {
      return this.normalize('element') ? true : false
   }

   toggle() {
      if (this.possible()) {
         this.normalize('element')
            ? this.exit()
            : this.enter()
      }
   }

   enter() {
      this.possible() && this.normalize('request')
   }

   exit() {
      this.possible() && this.normalize('exit')
   }

   normalize(func) {
      for (var prefix of [undefined, 'moz', 'webkit']) {
         var requestFullscreen = prefix + 'RequestFullscreen'
         var fullscreenElement = prefix + 'FullscreenElement'
         var fullscreenEnabled = prefix + 'FullscreenEnabled'
         var exitFullscreen = prefix + 'ExitFullscreen'

         if (!prefix) {
            requestFullscreen = 'requestFullscreen'
            fullscreenElement = 'fullscreenElement'
            fullscreenEnabled = 'fullscreenEnabled'
            exitFullscreen = 'exitFullscreen'
         }

         if (document.documentElement[requestFullscreen] !== undefined) {
            if (func == 'possible') return document.documentElement[requestFullscreen] ? true : false
            if (func == 'element') return document[fullscreenElement]
            if (func == 'exit') return document[exitFullscreen]()
            if (func == 'request') return document.documentElement[requestFullscreen]()
            if (func == 'enabled') return document[fullscreenEnabled]
         }
      }

      return undefined
   }
}

if (module) module.exports = CSENGINE_FULLSCREEN
