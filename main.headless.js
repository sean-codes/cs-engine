const PartCamera = require('./src/Camera')
const PartDraw = require('./src/Draw')
const PartFps = require('./src/Fps')
const PartFullscreen = require('./src/Fullscreen')
const PartInputKeyboard = require('./src/InputKeyboard')
const PartInputMouse = require('./src/InputMouse')
const PartInputTouch = require('./src/InputTouch')
const PartLoader = require('./src/Loader')
const PartLoop = require('./src/Loop')
const PartMath = require('./src/Math')
const PartNetwork = require('./src/Network')
const PartObject = require('./src/Object')
const PartRoom = require('./src/Room')
const PartSetup = require('./src/Setup')
const PartSound = require('./src/Sound')
const PartSprite = require('./src/Sprite')
const PartSurface = require('./src/Surface')
const PartStorage = require('./src/Storage')
const PartTimer = require('./src/Timer')
const PartVector = require('./src/Vector')

module.exports = class cs {
   constructor(options = {}) {
      this.options = options

      // handy
      this.clone = (object) => { return JSON.parse(JSON.stringify(object)) }
      this.default = (want, ifnot) => { return want != null ? want : ifnot }

      // 1. setup
      this.headless = true
      this.path = options.path
      this.start = options.start || function() {}
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

      this.fps = new PartFps(this)
      this.loader = new PartLoader(this)
      this.loop = new PartLoop(this)
      this.math = new PartMath(this)
      this.network = new PartNetwork(this)
      this.object = new PartObject(this)
      this.room = new PartRoom(this)
      this.setup = new PartSetup(this)
      this.storage = new PartStorage(this)
      this.timer = new PartTimer(this)
      this.vector = new PartVector(this)

      // load
      this.start({ cs: this })
      this.loop.start()
   }
}
