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
   this.canvas = canvas
   this.ctx = canvas.getContext('2d')
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
      scripts: assets && assets.scripts ? assets.scripts : [],
      sprites: assets && assets.sprites ? assets.sprites : [],
      storages: assets && assets.storages ? assets.storages : [],
      sounds: assets && assets.sounds ? assets.sounds : [],
   }

   // 2. load parts
   console.groupCollapsed('Loading Engine...')

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

   let loading = parts.length
   const dateStartLoading = Date.now()

   const checkDone = () => {
      loading -= 1

      if (!loading) {
         console.groupEnd()
         const engineLoadTime = Math.round(Date.now() - dateStartLoading)
         console.log(`Engine Loaded in ${engineLoadTime}ms`)
         cs.loader.load()
      }
   }

   for (var part of parts) {
      console.log(`Loading Part: ${part.path.split('/').pop()}`)
      const htmlScript = document.createElement('script')
      htmlScript.src = `${part.path}.js?v=${this.version}`
      htmlScript.onload = checkDone
      document.body.appendChild(htmlScript)
   }
}
