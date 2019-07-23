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
const Surface = require('./parts/Surface')
const Sprite = require('./parts/Sprite')
const Storage = require('./parts/Storage')
const Timer = require('./parts/Timer')
const Vector = require('./parts/Vector')

module.exports = class cs {
   constructor(options) {
      const {
         canvas,
         assets
      } = options

      const sounds = assets && assets.sounds ? assets.sounds : []
      const scripts = assets && assets.scripts ? assets.scripts : []
      const objects = assets && assets.objects ? assets.objects : []
      const sprites = assets && assets.sprites ? assets.sprites : []
      const storages = assets && assets.storages ? assets.storages : []

      // 1. build engine
      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
      this.maxSize = options.maxSize || 2000
      this.start = options.start
      this.userStep = options.step
      this.userDraw = options.draw

      // general handies
      this.clone = function(object) { return JSON.parse(JSON.stringify(object)) }
      this.default = function(want, ifnot) { return want != null ? want : ifnot }

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
      this.sprite = new Sprite(this)
      this.storage = new Storage(this)
      this.surface = new Surface(this)

      // 2. load assets
      for (var object of objects) {
         this.object.addTemplate(object.type, object.src)
      }

      // 3. setup
      this.setup.run()
   }
}
