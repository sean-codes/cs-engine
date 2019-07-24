const Camera = require('./parts/Camera')
const Draw = require('./parts/Draw')
const Fps = require('./parts/Fps')
const Fullscreen = require('./parts/Fullscreen')
const InputKeyboard = require('./parts/InputKeyboard')
const InputMouse = require('./parts/InputMouse')
const InputTouch = require('./parts/InputTouch')
const Loop = require('./parts/Loop')
const Math = require('./parts/Math')
const Network = require('./parts/Network')
const Object = require('./parts/Object')
const Room = require('./parts/Room')
const Setup = require('./parts/Setup')
const Sound = require('./parts/Sound')
const Sprite = require('./parts/Sprite')
const Surface = require('./parts/Surface')
const Storage = require('./parts/Storage')
const Timer = require('./parts/Timer')
const Vector = require('./parts/Vector')

module.exports = class cs {
   constructor(options) {
      const {
         canvas,
         assets
      } = options

      // 1. build engine
      this.clone = function(object) { return JSON.parse(JSON.stringify(object)) }
      this.default = function(want, ifnot) { return want != null ? want : ifnot }

      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
      this.maxSize = options.maxSize || 2000
      this.start = options.start
      this.userStep = options.step
      this.userDraw = options.draw
      this.global = options.global || {}
      this.progress = options.progress || function() {}
      this.focus = options.focus || function() {}

      this.camera = new Camera(this)
      this.draw = new Draw(this)
      this.fps = new Fps(this)
      this.fullscreen = new Fullscreen(this)
      this.inputKeyboard = new InputKeyboard(this)
      this.inputMouse = new InputMouse(this)
      this.inputTouch = new InputTouch(this)
      this.loop = new Loop(this)
      this.math = new Math(this)
      this.network = new Network(this)
      this.object = new Object(this)
      this.room = new Room(this)
      this.setup = new Setup(this)
      this.sound = new Sound(this)
      this.sprite = new Sprite(this)
      this.storage = new Storage(this)
      this.surface = new Surface(this)
      this.timer = new Timer(this)
      this.vector = new Vector(this)

      // 2. load assets
      this.objects = options.objects || {}
      this.sprites = options.sprites || []

      this.assets = {
         sounds: assets && assets.sounds ? assets.sounds : [],
         scripts: assets && assets.scripts ? assets.scripts : [],
         sprites: assets && assets.sprites ? assets.sprites : [],
         storages: assets && assets.storages ? assets.storages : [],
      }

      // 3. setup
      this.setup.run()
   }
}
