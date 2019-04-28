cs.setup = function() {
   // Listen for Errors
   window.onerror = function(errorMsg, url, lineNumber) { cs.loop.run = false }
   // Initiate Inputs
   cs.ctx = this.canvas.getContext('2d')
   cs.canvas.tabIndex = 1000
   cs.canvas.style.outline = 'none'
   // cs.canvas.style.touchAction = 'none'
   cs.canvas.addEventListener('click', cs.sound.enable.bind(cs.sound))
   cs.canvas.addEventListener('keydown', cs.key.eventDown)
   cs.canvas.addEventListener('keyup', cs.key.eventUp)
   cs.canvas.addEventListener('mousemove', cs.mouse.eventMove)
   cs.canvas.addEventListener('mousedown', function(e) {
      cs.mouse.eventDown(e);
      cs.sound.enable()
   })
   cs.canvas.addEventListener('mouseup', cs.mouse.eventUp)
   cs.canvas.addEventListener('mouseout', cs.mouse.eventUp)
   cs.canvas.addEventListener("pointerdown", cs.touch.eventPointerDown)
   cs.canvas.addEventListener("pointermove", cs.touch.eventPointerMove)
   cs.canvas.addEventListener("pointerup", cs.touch.eventPointerUp)

   cs.canvas.addEventListener("touchstart", cs.touch.eventTouchDown)
   cs.canvas.addEventListener("touchmove", cs.touch.eventTouchMove)
   cs.canvas.addEventListener("touchend", cs.touch.eventTouchUp)

   // cs.canvas.addEventListener("pointerdown", cs.touch.eventDown)
   // cs.canvas.addEventListener("pointermove", cs.touch.eventMove)
   // cs.canvas.addEventListener("pointerup", cs.touch.eventUp)

   // cs.canvas.addEventListener("pointercancel", cs.touch.eventUp, false)

   // View, Game and GUI surfaces
   cs.surface.create({ name: 'gui', oneToOne: true, useCamera: false, depth: 0 })
   cs.surface.create({ name: 'game', oneToOne: true, useCamera: true,  depth: 10 })

   // Sound
   //cs.sound.active = cs.sound.init();
   window.onfocus = function(e) {
      cs.focus(true)
   }

   window.onblur = function(e) {
      cs.focus(false)
      cs.sound.toggleActive(false, e)
   }

   // watch for resizing
   cs.resize = function() {
      var maxSize = cs.maxSize
      cs.width = cs.canvas.clientWidth
      cs.height = cs.canvas.clientHeight
      cs.clampWidth = cs.width
      cs.clampHeight = cs.height

      if (cs.clampWidth > maxSize) {
         cs.clampHeight = cs.clampHeight / cs.clampWidth * maxSize
         cs.clampWidth = maxSize
      }

      if (cs.clampHeight > maxSize) {
         cs.clampWidth = cs.clampWidth / cs.clampHeight * maxSize
         cs.clampHeight = maxSize
      }

      cs.clampWidth = Math.ceil(cs.clampWidth)
      cs.clampHeight = Math.ceil(cs.clampHeight)

      cs.canvas.width = cs.clampWidth
      cs.canvas.height = cs.clampHeight

      cs.camera.resize()
      cs.surface.resize()
      cs.object.resize()
   }

   // Sprites/Storage/Sound
   cs.sprite.init()
   cs.storage.init()

   // room/camera
   cs.room.setup({
      width: cs.canvas.getBoundingClientRect().width,
      height: cs.canvas.getBoundingClientRect().height
   })

   cs.camera.setup({
      width: cs.canvas.getBoundingClientRect().width,
      height: cs.canvas.getBoundingClientRect().height
   })

   // bootstrapping
   cs.start()
   window.onresize = cs.resize
   cs.resize()

   cs.loop.step()
   cs.loop.run = true
}
