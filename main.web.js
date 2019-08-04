cs = {}
cs.load = function(options) {
   this.options = options

   // handy
   this.clone = (object) => { return JSON.parse(JSON.stringify(object)) }
   this.default = (want, ifnot) => { return want != null ? want : ifnot }

   // 1. setup
   this.canvas = options.canvas
   this.ctx = this.canvas.getContext('2d')
   this.path = options.path
   if (!options.path) {
      var scriptTag = document.querySelector('#cs-main-web')
      if (!scriptTag) return console.log(
         'ERROR: could not load parts.',
         '\r\nneed options.path or id="cs-main-web" on script tag'
      )
      
      var path = new URL(scriptTag.src)
      this.path = path.pathname.replace('/main.web.js', '')
   }

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
      { path: this.path + '/src/Camera' },
      { path: this.path + '/src/Draw' },
      { path: this.path + '/src/Fps' },
      { path: this.path + '/src/Fullscreen' },
      { path: this.path + '/src/InputKeyboard' },
      { path: this.path + '/src/InputMouse' },
      { path: this.path + '/src/InputTouch' },
      { path: this.path + '/src/Loop' },
      { path: this.path + '/src/Loader' },
      { path: this.path + '/src/Math' },
      { path: this.path + '/src/Network' },
      { path: this.path + '/src/Object' },
      { path: this.path + '/src/Room' },
      { path: this.path + '/src/Setup' },
      { path: this.path + '/src/Sound' },
      { path: this.path + '/src/Sprite' },
      { path: this.path + '/src/Storage' },
      { path: this.path + '/src/Surface' },
      { path: this.path + '/src/Timer' },
      { path: this.path + '/src/Vector' },
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
