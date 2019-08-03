const PartCamera = require('./parts/Camera')
const PartDraw = require('./parts/Draw')
const PartFps = require('./parts/Fps')
const PartFullscreen = require('./parts/Fullscreen')
const PartInputKeyboard = require('./parts/InputKeyboard')
const PartInputMouse = require('./parts/InputMouse')
const PartInputTouch = require('./parts/InputTouch')
const PartLoader = require('./parts/Loader')
const PartLoop = require('./parts/Loop')
const PartMath = require('./parts/Math')
const PartNetwork = require('./parts/Network')
const PartObject = require('./parts/Object')
const PartRoom = require('./parts/Room')
const PartSetup = require('./parts/Setup')
const PartSound = require('./parts/Sound')
const PartSprite = require('./parts/Sprite')
const PartSurface = require('./parts/Surface')
const PartStorage = require('./parts/Storage')
const PartTimer = require('./parts/Timer')
const PartVector = require('./parts/Vector')

module.exports = class cs {
   constructor(options) {
      this.options = options
      
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

      this.camera = new PartCamera(this)
      this.draw = new PartDraw(this)
      this.fps = new PartFps(this)
      this.fullscreen = new PartFullscreen(this)
      this.inputKeyboard = new PartInputKeyboard(this)
      this.inputMouse = new PartInputMouse(this)
      this.inputTouch = new PartInputTouch(this)
      this.loader = new PartLoader(this)
      this.loop = new PartLoop(this)
      this.math = new PartMath(this)
      this.network = new PartNetwork(this)
      this.object = new PartObject(this)
      this.room = new PartRoom(this)
      this.setup = new PartSetup(this)
      this.sound = new PartSound(this)
      this.sprite = new PartSprite(this)
      this.storage = new PartStorage(this)
      this.surface = new PartSurface(this)
      this.timer = new PartTimer(this)
      this.vector = new PartVector(this)

      // load
      this.loader.load() // loader will call cs.start()
   }
}
