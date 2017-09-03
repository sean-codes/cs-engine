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
      this.sprites = info.sprites
      this.scripts = this.scripts.concat(info.scripts)

      // When done loading we run this
      this.startEvent = info.start

      // Load Everything
      this.loading = this.scripts.length + this.sprites.length
      this.loadScripts(this.scripts)
      this.loadSprites(this.sprites)
   }

   this.loadScripts = function(scripts){
      for(var script of scripts){
         this.loadScript(script)
      }
   }

   this.loadScript = function(script){
      var that = this
      script.html = document.createElement('script')
      script.html.src = script.path + '.js'
      script.html.onload = function() { that.onload() }
      document.head.appendChild(script.html)
   }

   this.loadSprites = function(sprites){
      for(var sprite of sprites){
         this.loadSprite(sprite)
      }
   }

   this.loadSprite = function(sprite){
      var that = this
      sprite.html = document.createElement('img')
      sprite.html.src = sprite.path + '.png'
      sprite.html.onload = function() { that.onload() }
      document.head.appendChild(sprite.html)
   }

   this.onload = function(){
      this.loading -= 1
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
