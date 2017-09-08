//---------------------------------------------------------------------------------------------//
//------------------------------------| Core Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
var cs = new function(){
   // Core Path and Parts
   this.path = document.getElementById('cs-core').src+'/..'

   // Resources
   this.sounds = []
   this.sprites = []
   this.storages = []
   this.scripts = [
      { path: this.path + '/parts/camera' },
      { path: this.path + '/parts/draw' },
      { path: this.path + '/parts/fps' },
      { path: this.path + '/parts/input' },
      { path: this.path + '/parts/keys' },
      { path: this.path + '/parts/loop' },
      { path: this.path + '/parts/math' },
      { path: this.path + '/parts/mouse' },
      { path: this.path + '/parts/network' },
      { path: this.path + '/parts/object' },
      { path: this.path + '/parts/particle' },
      { path: this.path + '/parts/room' },
      { path: this.path + '/parts/setup' },
      { path: this.path + '/parts/sound' },
      { path: this.path + '/parts/sprite' },
      { path: this.path + '/parts/storage' },
      { path: this.path + '/parts/surface' },
      { path: this.path + '/parts/touch' }
   ]

   // Globals / For user
   this.global = {}
   this.script = {}
   this.objects = {}

   // Initialize: Load Scripts and Sprites. Setup canvas
   this.load = function(info){
      // Setup core info
      this.viewcanvas = info.canvas
      this.start = info.start

      // Resources
      this.scripts = this.scripts.concat(info.scripts || [])
      this.sprites = this.sprites.concat(info.sprites || [])
      this.sounds = this.sounds.concat(info.sounds || [])
      this.storages = this.storages.concat(info.storages || [])
      this.preload()
   }

   this.preload = function(){
      this.loading = this.scripts.length
         + this.sprites.length
         + this.sounds.length
         + this.storages.length

      // Load Scripts/Sprites/Sounds
      for(var script of this.scripts){
         this.loadScript(script)
      }

      for(var sprite of this.sprites){
         this.loadSprite(sprite)
      }

      for(var sound of this.sounds){
         this.loadSound(sound)
      }

      for(var storage of this.storages){
         this.loadStorage(storage)
      }
   }

   this.loadScript = function(script){
      var that = this
      script.html = document.createElement('script')
      script.html.src = script.path + '.js'
      script.html.onload = function() { that.onload() }
      document.head.appendChild(script.html)
   }

   this.loadSprite = function(sprite){
      var that = this
      sprite.html = document.createElement('img')
      sprite.html.src = sprite.path + '.png'
      sprite.html.onload = function() { that.onload() }
   }

   this.loadStorage = function(storage){
      var that = this
      storage.data = {}
      storage.request = new XMLHttpRequest()
      storage.request.onreadystatechange = function() {
         if(this.readyState == 4){
            var data = JSON.parse(this.responseText)
            storage.data = data
            that.onload()
         }
      }
      storage.request.open("POST", `./${storage.path}.json`, true)
      storage.request.send()
   }

   this.loadSound = function(sound){
      var that = this

      sound.loaded = false
      sound.src = sound.path + '.wav'
      sound.buffer = null
      sound.request = new XMLHttpRequest()

      sound.request.open('GET', sound.src, true);
      sound.request.responseType = 'arraybuffer';

      sound.request.onload = function(){
         window.AudioContext = window.AudioContext || window.webkitAudioContext
         if(window.AudioContext){
            new AudioContext().decodeAudioData(this.response, function(buffer){
               sound.buffer = buffer
            })
         }
         that.onload()
      }
      sound.request.send();
   }


   this.onload = function(){
      this.loading -= 1
      if(!this.loading && this.start){
         cs.setup()
      }
   }
}
