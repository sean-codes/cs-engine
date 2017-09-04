//---------------------------------------------------------------------------------------------//
//------------------------------------| Core Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
var cs = new function(){
   // Core Path and Parts
   this.path = document.getElementById('cs-core').src+'/..'
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
      { path: this.path + '/parts/sound' },
      { path: this.path + '/parts/sprite' },
      { path: this.path + '/parts/start' },
      { path: this.path + '/parts/storage' },
      { path: this.path + '/parts/surface' },
      { path: this.path + '/parts/touch' }
   ]

   // Initialize: Load Scripts and Sprites. Setup canvas
   this.init = function(info){
      // Setup core info
      this.viewcanvas = info.canvas
      this.startEvent = info.start

      // Resources
      this.scripts.concat(info.scripts)
      this.sprites = info.sprites
      this.sounds = info.sounds


      // PreLoad Scripts/Sprites
      this.preload()
   }
   this.preload = function(){
      this.loading = this.scripts.length + this.sprites.length + this.sounds.length
      // Load Scripts
      for(var script of this.scripts){
         this.loadScript(script)
      }
      // Load Sprites
      for(var sprite of this.sprites){
         this.loadSprite(sprite)
      }

      // Load sounds
      for(var sound of this.sounds){
         this.loadSound(sound)
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
      console.log(this.loading)
      if(!this.loading && this.startEvent){
         cs.start()
      }
   }
}

//---------------------------------------------------------------------------------------------//
//-----------------------------| Global Variables and Scripts |--------------------------------//
//---------------------------------------------------------------------------------------------//
cs.global = {}
cs.script = {}
cs.save = {}
cs.objects = {}
cs.sprites = {}
