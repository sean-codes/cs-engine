cs = {}
cs.load = function(options) {
   const {
      canvas,
      assets
   } = options

   // handy
   this.clone = (object) => { return JSON.parse(JSON.stringify(object)) }
   this.default = (want, ifnot) => { return want != null ? want : ifnot }

   // 1. build the engine
   this.objects = options.objects || {}
   this.sprites = options.sprites || []
   this.storages = options.storages || {}

   this.assets = {
      scripts: assets && assets.scripts ? assets.scripts : [],
      sprites: assets && assets.sprites ? assets.sprites : [],
      storages: assets && assets.storages ? assets.storages : []
   }

   this.canvas = canvas
   this.ctx = canvas.getContext('2d')
   this.maxSize = options.maxSize || 2000
   this.start = options.start
   this.userStep = options.step
   this.userDraw = options.draw
   this.progress = options.progress || function() {}
   this.focus = options.focus || function() {}
   this.version = options.version || Math.random()
   this.global = options.global || {}
   this.progress = options.progress || function() {}
   this.focus = options.focus || function() {}
   this.path = options.parts
   this.script = {}

   // 2. load core
   let loadedCore = false
   this.dateStartLoading = Date.now()
   this.loading = 0
   console.groupCollapsed('Loading Engine...')

   const checkDone = () => {
      this.loading -= 1
      if (!this.loading) {
         console.groupEnd()
         const engineLoadTime = Math.round(Date.now() - this.dateStartLoading)
         console.log(`Engine Loaded in ${engineLoadTime}ms`)
         cs.setup.run()
      }
   }

   const loadScripts = (scripts = [], done) => {
      for (var script of scripts) {
         this.loading += 1
         const htmlScript = document.createElement('script')
         htmlScript.src = `${script.path}.js?v=${this.version}`
         htmlScript.onload = checkDone
         document.body.appendChild(htmlScript)
         console.log(`Loading Script: ${script.path}`)
      }
   }

   const loadSprites = (sprites = []) => {
      for (var sprite of sprites) {
         this.loading += 1
         cs.sprites.push(sprite)
         console.log(`Loading Sprite: ${sprite.path}`)
         sprite.html = document.createElement('img')
         sprite.html.src = sprite.path + '.png?v=' + this.version
         sprite.html.onload = checkDone
      }
   }

   loadSprites(this.assets.sprites)
   loadScripts([
      { path: this.path + '/parts/Camera' },
      { path: this.path + '/parts/Draw' },
      { path: this.path + '/parts/Fps' },
      { path: this.path + '/parts/Fullscreen' },
      { path: this.path + '/parts/InputKeyboard' },
      { path: this.path + '/parts/InputMouse' },
      { path: this.path + '/parts/InputTouch' },
      { path: this.path + '/parts/Loop' },
      { path: this.path + '/parts/Math' },
      { path: this.path + '/parts/Network' },
      { path: this.path + '/parts/Object' },
      { path: this.path + '/parts/Room' },
      { path: this.path + '/parts/Setup' },
      { path: this.path + '/parts/Sound' },
      { path: this.path + '/parts/Sprite' },
      { path: this.path + '/parts/Storage' },
      { path: this.path + '/parts/Surface' },
      { path: this.path + '/parts/Timer' },
      { path: this.path + '/parts/vector' },
      ...this.assets.scripts
   ])
}

//    // Initialize: Load Scripts and Sprites. Setup canvas
//    this.load = (assets) => {
//       // Resources
//       this.parts = [
//          { path: this.path + '/parts/camera' },
//          { path: this.path + '/parts/draw' },
//          { path: this.path + '/parts/fps' },
//          { path: this.path + '/parts/fullscreen' },
//          { path: this.path + '/parts/keys' },
//          { path: this.path + '/parts/loop' },
//          { path: this.path + '/parts/math' },
//          { path: this.path + '/parts/mouse' },
//          { path: this.path + '/parts/network' },
//          { path: this.path + '/parts/object' },
//          { path: this.path + '/parts/room' },
//          { path: this.path + '/parts/setup' },
//          { path: this.path + '/parts/sound' },
//          { path: this.path + '/parts/sprite' },
//          { path: this.path + '/parts/storage' },
//          { path: this.path + '/parts/surface' },
//          //{ path: this.path + '/parts/text' },
//          { path: this.path + '/parts/touch' },
//          { path: this.path + '/parts/timer' },
//          { path: this.path + '/parts/vector' },
//       ]
//       this.scripts = this.scripts.concat(this.assets.scripts || [])
//       this.sprites = this.sprites.concat(this.assets.sprites || [])
//       this.sounds = this.sounds.concat(this.assets.sounds || [])
//       this.storages = this.storages.concat(this.assets.storages || [])
//       this.preload()
//    }
//
//    this.preload = function() {
//       this.loading = {
//          scripts: { item: 0, required: this.scripts.length },
//          sprites: { item: 0, required: this.sprites.length },
//          sounds: { item: 0, required: this.sounds.length },
//          storages: { item: 0, required: this.storages.length },
//          total: { item: 0, required: this.scripts.length + this.sprites.length + this.sounds.length + this.storages.length, timer: performance.now() }
//       }
//
//       // Load Scripts/Sprites/Sounds
//       console.groupCollapsed('Loading...')
//       if (this.storages.length) return this.loadstorages()
//       if (this.sprites.length) return this.loadsprites()
//       if (this.sounds.length) return this.loadsounds()
//       if (this.scripts.length) return this.loadscripts()
//    }
//
//    this.loadscripts = function() {
//       var script = this.scripts[this.loading.scripts.item]
//       var that = this
//
//       script.html = document.createElement('script')
//       script.html.src = script.path + '.js?v=' + this.version
//       script.html.onload = function() { that.onload('scripts', 1) }
//       document.head.appendChild(script.html)
//    }
//
//    this.loadsprites = function() {
//       if (!this.sprites.length) return this.onload('sprites', 0)
//       var sprite = this.sprites[this.loading.sprites.item]
//       var that = this
//       sprite.html = document.createElement('img')
//       sprite.html.src = sprite.path + '.png?v=' + this.version
//       sprite.html.onload = function() { that.onload('sprites', 1) }
//    }
//
//    this.loadstorages = function() {
//       if (!this.storages.length) return this.onload('storages', 0)
//       var storage = this.storages[this.loading.storages.item]
//       storage.data = {}
//
//       // attempt to use localstorage
//       if (!storage.path) {
//          storage.data = JSON.parse(window.localStorage.getItem(storage.location))
//          this.onload('storages', 1)
//       }
//
//       // fetch the storage .json
//       if (storage.path) {
//          var that = this
//          storage.request = new XMLHttpRequest()
//          storage.request.onreadystatechange = function() {
//             if (this.readyState == 4) {
//                var data = JSON.parse(this.responseText)
//                storage.data = data
//                that.onload('storages', 1)
//             }
//          }
//          storage.request.open("GET", './' + storage.path + '.json?v=' + this.version, true)
//          storage.request.send()
//       }
//    }
//
//    this.loadsounds = function(sound) {
//       if (!this.sounds.length) return this.onload('sounds', 0)
//       var sound = this.sounds[this.loading.sounds.item]
//
//       sound.loaded = false
//       sound.src = sound.path + '.wav?v=' + this.version
//       sound.buffer = null
//       sound.request = new XMLHttpRequest()
//
//       sound.request.open('GET', sound.src, true);
//       sound.request.responseType = 'arraybuffer';
//
//       var that = this
//       sound.request.onload = function() {
//          window.AudioContext = window.AudioContext || window.webkitAudioContext
//          if (window.AudioContext) {
//             new AudioContext().decodeAudioData(this.response, function(buffer) {
//                sound.buffer = buffer
//             })
//          }
//          that.onload('sounds', 1)
//       }
//       sound.request.send();
//    }
//
//
//    this.onload = function(type, loaded) {
//       this.loading.total.item += loaded
//       this.loading[type].item += loaded
//
//       var loadInfo = {
//          percent: Math.floor(this.loading.total.item / this.loading.total.required * 100),
//          finished: this.loading.total.item === this.loading.total.required,
//          type: type,
//          file: this[type][this.loading.total.item],
//          current: this.loading.total.item,
//          totalRequired: this.loading.total.required,
//          totalType: this.loading[type].required
//       }
//
//       this.progress(cs.clone(loadInfo))
//
//       var loadMessage = 'loaded ' + loadInfo.type + ' ' + loadInfo.current + '/' + loadInfo.totalRequired + ' - total: ' + loadInfo.percent + '%'
//       console.log(loadMessage)
//
//       if (this.loading[type].item < this.loading[type].required) {
//          return this['load' + type]()
//       }
//
//       if (this.loading.total.item == this.loading.total.required && this.start) {
//          console.groupEnd()
//          console.log('Loaded in ' + Math.ceil(performance.now() - this.loading.total.timer) + 'ms')
//          return cs.setup()
//       }
//
//       var loadOrder = ['storages', 'sprites', 'sounds', 'scripts']
//       this['load' + loadOrder[loadOrder.indexOf(type) + 1]]()
//    }
//
//    // load them! :]
//    this.load(options.assets)
// }
