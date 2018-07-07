//---------------------------------------------------------------------------------------------//
//------------------------------------| Core Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
var cs = new function(){
	// Handy
	this.default = function(want, ifnot) { return want != null ? want : ifnot }

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
      { path: this.path + '/parts/text' },
      { path: this.path + '/parts/touch' }
   ]

   // Globals / For user
   this.global = {}
   this.script = {}

   // Initialize: Load Scripts and Sprites. Setup canvas
   this.load = function(info){
      // Setup core info
      this.view = info.canvas
      this.start = info.start

      // Resources
      this.scripts = this.scripts.concat(info.scripts || [])
      this.sprites = this.sprites.concat(info.sprites || [])
      this.sounds = this.sounds.concat(info.sounds || [])
      this.storages = this.storages.concat(info.storages || [])
      this.preload()
   }

   this.preload = function(){
		this.loading = {
			scripts: { item: 0, required: this.scripts.length },
			sprites: { item: 0, required: this.sprites.length },
			sounds: { item: 0, required: this.sounds.length },
			storages: { item: 0, required: this.storages.length },
			total: { item: 0, required: this.scripts.length + this.sprites.length + this.sounds.length + this.storages.length, timer: performance.now() }
		}

      // Load Scripts/Sprites/Sounds
		console.groupCollapsed('Loading...')
		if(this.storages.length) return this.loadstorages()
      if(this.sprites.length) return this.loadsprites()
      if(this.sounds.length) return this.loadsounds()
		if(this.scripts.length) return this.loadscripts()
   }

   this.loadscripts = function(){
		var script = this.scripts[this.loading.scripts.item]
      var that = this

      script.html = document.createElement('script')
      script.html.src = script.path + '.js?v='+Math.random()
      script.html.onload = function() { that.onload('scripts', 1) }
      document.head.appendChild(script.html)
   }

   this.loadsprites = function(){
		if(!this.sprites.length) return this.onload('sprites', 0)
		var sprite = this.sprites[this.loading.sprites.item]
      var that = this
      sprite.html = document.createElement('img')
      sprite.html.src = sprite.path + '.png?v='+Math.random()
      sprite.html.onload = function() { that.onload('sprites', 1) }
   }

   this.loadstorages = function(){
		if(!this.storages.length) return this.onload('storages', 0)
		var storage = this.storages[this.loading.storages.item]
      var that = this
      storage.data = {}
      storage.request = new XMLHttpRequest()
      storage.request.onreadystatechange = function() {
         if(this.readyState == 4){
            var data = JSON.parse(this.responseText)
            storage.data = data
            that.onload('storages', 1)
         }
      }
      storage.request.open("POST", `./${storage.path}.json?v=`+Math.random(), true)
      storage.request.send()
   }

   this.loadsounds = function(sound){
		if(!this.sounds.length) return this.onload('sounds', 0)
		var sound = this.sounds[this.loading.sounds.item]
      var that = this

      sound.loaded = false
      sound.src = sound.path + '.wav?v='+Math.random()
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
         that.onload('sounds', 1)
      }
      sound.request.send();
   }


   this.onload = function(type, loaded){
      this.loading.total.item += loaded
		this.loading[type].item += loaded
		console.log('loaded ' + type + ' ' + this.loading[type].item + '/' + this.loading[type].required + ' - total: ' + Math.floor(this.loading.total.item/this.loading.total.required*100) + '%')

		if(this.loading[type].item < this.loading[type].required){
			return this['load'+type]()
		}

      if(this.loading.total.item == this.loading.total.required && this.start){
			console.groupEnd()
			console.log('Loaded in ' + Math.ceil(performance.now() - this.loading.total.timer) + 'ms')
         return cs.setup()
      }

		var loadOrder = ['storages', 'sprites', 'sounds', 'scripts']
		this['load'+loadOrder[loadOrder.indexOf(type)+1]]()
   }
}
