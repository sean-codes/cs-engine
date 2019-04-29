cs.fullscreen = {
   possible: function() {
      return this.normalize('possible')
   },

   is: function() {
      return this.normalize('element') ? true : false
   },

   toggle: function() {
      if (this.possible) {
         this.normalize('element')
            ? this.normalize('exit')
            : this.normalize('request')
      }
   },

   normalize: function(func) {
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