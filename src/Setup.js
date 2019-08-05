//----------------------------------------------------------------------------//
//------------------------------| CS ENGINE: SETUP |--------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_SETUP {
      constructor(cs) {
         this.cs = cs
      }

      run() {
         // Initiate Inputs
         if (!this.cs.headless) {
            this.cs.ctx = this.cs.canvas.getContext('2d')
            this.cs.canvas.tabIndex = 0
            this.cs.canvas.style.outline = 'none'
            this.cs.canvas.style.touchAction = 'none'

            this.cs.canvas.addEventListener('click', () => {
               this.cs.sound.enable()
               this.cs.canvas.focus()
            })

            this.cs.canvas.addEventListener('keydown', (e) => this.cs.inputKeyboard.eventDown(e))
            this.cs.canvas.addEventListener('keyup', (e) => this.cs.inputKeyboard.eventUp(e))

            if (this.cs.canvas.setPointerCapture) {
               this.cs.canvas.addEventListener("pointerdown", (e) => this.cs.inputTouch.eventPointerDown(e))
               this.cs.canvas.addEventListener("pointermove", (e) => this.cs.inputTouch.eventPointerMove(e))
               this.cs.canvas.addEventListener("pointerup", (e) => this.cs.inputTouch.eventPointerUp(e))
               this.cs.canvas.addEventListener("pointerout", (e) => this.cs.inputTouch.eventPointerUp(e))
            } else {
               this.cs.canvas.addEventListener("touchstart", (e) => this.cs.inputTouch.eventTouchDown(e))
               this.cs.canvas.addEventListener("touchmove", (e) => his.cs.inputTouch.eventTouchMove(e))
               this.cs.canvas.addEventListener("touchend", (e) => this.cs.inputTouch.eventTouchUp(e))

               this.cs.canvas.addEventListener('mousedown', (e) => this.cs.inputMouse.eventDown(e))
               this.cs.canvas.addEventListener('mousemove', (e) => this.cs.inputMouse.eventMove(e))
               this.cs.canvas.addEventListener('mouseup', (e) => this.cs.inputMouse.eventUp(e))
               this.cs.canvas.addEventListener('mouseout', (e) => this.cs.inputMouse.eventUp(e))
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
                  this.cs.inputKeyboard.blur()
               }

               window.onresize = this.cs.resize.bind(this)
            }
            this.cs.resize()
            this.cs.sprite.init()
         }

         // Sprites/Storage/Sound/Scripts
         this.cs.storage.init()
         this.cs.object.init()
         this.cs.script.init()

         // bootstrapping
         this.cs.start({ cs: this.cs })
         this.cs.loop.start()
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_SETUP
      : cs.setup = new CSENGINE_SETUP(cs)
})()
