//----------------------------------------------------------------------------//
//----------------------------| CS ENGINE: LOADER |---------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_LOADER {
      constructor(cs) {
         this.cs = cs

         this.start = 0
         this.loading =
            cs.assets.sprites.length +
            cs.assets.scripts.length +
            cs.assets.sounds.length +
            cs.assets.storages.length

         this.loadTotal = this.loading
      }

      load() {
         if (!this.loading) {
            return this.cs.setup.run()
         }

         this.start = Date.now()
         console.groupCollapsed('Loading Assets...')

         this.loadScripts()
         this.loadSounds()
         this.loadSprites()
         this.loadStorages()
      }

      checkDone() {
         this.loading -= 1

         var loadInfo = {
            percent: Math.floor((this.loadTotal - this.loading) / this.loadTotal * 100),
            finished: !this.loading,
            current: this.loading,
            totalRequired: this.loadTotal
         }

         this.cs.progress(loadInfo)

         if (!this.loading) {
            console.groupEnd()
            const assetsLoadTime = Math.round(Date.now() - this.start)
            console.log(`Assets Loaded in ${assetsLoadTime}ms`)
            this.cs.setup.run()
         }
      }

      loadScripts() {
         for (const script of this.cs.assets.scripts) {
            console.log('Loading Script: ' + script.path)
            const htmlScript = document.createElement('script')
            htmlScript.src = script.path + '.js?v=' + this.cs.version
            htmlScript.onload = this.checkDone.bind(this)
            document.body.appendChild(htmlScript)
         }
      }

      loadSprites() {
         for (const sprite of this.cs.assets.sprites) {
            cs.sprites.push(sprite)
            console.log(`Loading Sprite: ${sprite.path}`)
            sprite.html = document.createElement('img')
            sprite.html.src = sprite.path + '.png?v=' + this.cs.version
            sprite.html.onload = this.checkDone.bind(this)
         }
      }

      loadSounds() {
         for (const sound of this.cs.assets.sounds) {
            this.cs.sounds.push(sound)
            console.log(`Loading Sound: ${sound.path}`)
            sound.loaded = false
            sound.src = sound.path + '.wav?v=' + this.version
            sound.buffer = null
            sound.request = new XMLHttpRequest()

            sound.request.open('GET', sound.src, true);
            sound.request.responseType = 'arraybuffer';

            sound.request.onload = (data) => {
               window.AudioContext = window.AudioContext || window.webkitAudioContext
               if (window.AudioContext) {
                  new AudioContext().decodeAudioData(data.currentTarget.response, function(buffer) {
                     sound.buffer = buffer
                  })
               }
               this.checkDone()
            }
            sound.request.send()
         }
      }

      loadStorages() {
         for (const storage of this.cs.assets.storages) {
            this.cs.storages.push(storage)
            storage.data = {}

            // attempt to use localstorage
            if (!storage.path) {
               storage.data = JSON.parse(window.localStorage.getItem(storage.location))
               this.checkDone()
            }

            // fetch the storage .json
            if (storage.path) {
               var that = this
               storage.request = new XMLHttpRequest()
               storage.request.onreadystatechange = function() {
                  if (this.readyState == 4) {
                     var data = JSON.parse(this.responseText)
                     storage.data = data
                     that.checkDone()
                  }
               }
               storage.request.open("GET", './' + storage.path + '.json?v=' + this.version, true)
               storage.request.send()
            }
         }
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_LOADER
      : cs.loader = new CSENGINE_LOADER(cs)
})()
