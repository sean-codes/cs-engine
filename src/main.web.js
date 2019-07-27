cs = {}
cs.load = function(options) {
   // handy
   this.clone = (object) => { return JSON.parse(JSON.stringify(object)) }
   this.default = (want, ifnot) => { return want != null ? want : ifnot }

   // 1. setup
   this.canvas = options.canvas
   this.ctx = this.canvas.getContext('2d')
   this.path = options.path
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

   this.objects = options.objects || {}
   this.script = options.script || {}
   this.sprites = options.sprites || []
   this.storages = options.storages || []
   this.sounds = options.sounds || []

   this.assets = {
      scripts: options.assets && options.assets.scripts ? options.assets.scripts : [],
      sprites: options.assets && options.assets.sprites ? options.assets.sprites : [],
      storages: options.assets && options.assets.storages ? options.assets.storages : [],
      sounds: options.assets && options.assets.sounds ? options.assets.sounds : [],
   }

   const parts = [
      { path: this.path + '/parts/Camera' },
      { path: this.path + '/parts/Draw' },
      { path: this.path + '/parts/Fps' },
      { path: this.path + '/parts/Fullscreen' },
      { path: this.path + '/parts/InputKeyboard' },
      { path: this.path + '/parts/InputMouse' },
      { path: this.path + '/parts/InputTouch' },
      { path: this.path + '/parts/Loop' },
      { path: this.path + '/parts/Loader' },
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
      { path: this.path + '/parts/Vector' },
   ]

   // 2. load
   console.groupCollapsed('Loading Engine...')
   let loading = parts.length
   const dateStartLoading = Date.now()

   for (var part of parts) {
      console.log('Loading Part: ' + part.path.split('/').pop())
      const htmlScript = document.createElement('script')
      htmlScript.src = `${part.path}.js?v=${this.version}`

      htmlScript.onload = () => {
         if (loading-- <= 1) {
            const engineLoadTime = Math.round(Date.now() - dateStartLoading)
            console.groupEnd()
            console.log(`Engine Loaded in ${engineLoadTime}ms`)
            cs.loader.load() // loader will call cs.start()
         }
      }

      document.body.appendChild(htmlScript)
   }
}
