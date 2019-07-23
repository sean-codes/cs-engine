class CSENGINE_SETUP {
   constructor(cs) {
      this.cs = cs
   }

   run() {
      // Initiate Inputs
      this.cs.ctx = this.cs.canvas.getContext('2d')
      this.cs.canvas.tabIndex = 1000
      this.cs.canvas.style.outline = 'none'
      // this.cs.canvas.style.touchAction = 'none'
      this.cs.canvas.addEventListener('click', function() {
         this.cs.sound.enable.bind(this.cs.sound)
         this.cs.canvas.focus()
      })

      this.cs.canvas.addEventListener('keydown', this.cs.inputKeyboard.eventDown)
      this.cs.canvas.addEventListener('keyup', this.cs.inputKeyboard.eventUp)

      if (this.cs.canvas.setPointerCapture) {
         this.cs.canvas.addEventListener("pointerdown", this.cs.inputTouch.eventPointerDown)
         this.cs.canvas.addEventListener("pointermove", this.cs.inputTouch.eventPointerMove)
         this.cs.canvas.addEventListener("pointerup", this.cs.inputTouch.eventPointerUp)
         this.cs.canvas.addEventListener("pointerout", this.cs.inputTouch.eventPointerUp)
      } else {
         this.cs.canvas.addEventListener("touchstart", this.cs.inputTouch.eventTouchDown)
         this.cs.canvas.addEventListener("touchmove", this.cs.inputTouch.eventTouchMove)
         this.cs.canvas.addEventListener("touchend", this.cs.inputTouch.eventTouchUp)

         this.cs.canvas.addEventListener('mousedown', this.cs.inputMouse.eventDown)
         this.cs.canvas.addEventListener('mousemove', this.cs.inputMouse.eventMove)
         this.cs.canvas.addEventListener('mouseup', this.cs.inputMouse.eventUp)
         this.cs.canvas.addEventListener('mouseout', this.cs.inputMouse.eventUp)
      }

      // View, Game and GUI surfaces
      this.cs.surface.create({ name: 'gui', oneToOne: true, useCamera: false, depth: 0 })
      this.cs.surface.create({ name: 'game', oneToOne: true, useCamera: true,  depth: 10 })

      // Sound
      //this.cs.sound.active = this.cs.sound.init();

      // watch for resizing
      this.cs.resize = () => {
         var maxSize = this.cs.maxSize
         this.cs.width = this.cs.canvas.clientWidth
         this.cs.height = this.cs.canvas.clientHeight
         this.cs.clampWidth = this.cs.width
         this.cs.clampHeight = this.cs.height

         if (this.cs.clampWidth > maxSize) {
            this.cs.clampHeight = this.cs.clampHeight / this.cs.clampWidth * maxSize
            this.cs.clampWidth = maxSize
         }

         if (this.cs.clampHeight > maxSize) {
            this.cs.clampWidth = this.cs.clampWidth / this.cs.clampHeight * maxSize
            this.cs.clampHeight = maxSize
         }

         this.cs.clampWidth = Math.ceil(this.cs.clampWidth)
         this.cs.clampHeight = Math.ceil(this.cs.clampHeight)

         this.cs.canvas.width = this.cs.clampWidth
         this.cs.canvas.height = this.cs.clampHeight

         this.cs.camera.resize()
         this.cs.surface.resize()
         this.cs.object.resize()
      }

      // Sprites/Storage/Sound
      this.cs.sprite.init()
      this.cs.storage.init()

      // room/camera
      this.cs.room.setup({
         width: this.cs.canvas.getBoundingClientRect().width,
         height: this.cs.canvas.getBoundingClientRect().height
      })

      this.cs.camera.setup({
         width: this.cs.canvas.getBoundingClientRect().width,
         height: this.cs.canvas.getBoundingClientRect().height
      })

      // window global functions
      if (window) {
         window.onerror = function(errorMsg, url, lineNumber) { this.cs.loop.stop() }

         window.onfocus = function(e) {
            this.cs.focus(true)
         }

         window.onblur = function(e) {
            this.cs.focus(false)
            this.cs.sound.toggleActive(false, e)
            this.cs.key.blur()
         }

         window.onresize = this.cs.resize.bind(this)
      }

      // bootstrapping
      this.cs.start({ cs: this.cs })
      this.cs.resize()
      this.cs.loop.start()
   }
}

if (module) module.exports = CSENGINE_SETUP
