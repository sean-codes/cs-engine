cs.setup = function() {
   // Listen for Errors
   window.onerror = function(errorMsg, url, lineNumber) { cs.loop.run = false }

   // Initiate Inputs
   cs.ctx = this.canvas.getContext('2d')
   cs.canvas.tabIndex = 1000
   cs.canvas.addEventListener('keydown', cs.key.updateDown)
   cs.canvas.addEventListener('keyup', cs.key.updateUp)
   cs.canvas.addEventListener('mousemove', cs.mouse.eventMove)
   cs.canvas.addEventListener('mousedown', function(e) { cs.mouse.eventDown(e);
      cs.sound.enable() })
   cs.canvas.addEventListener('mouseup', cs.mouse.eventUp)
   cs.canvas.addEventListener('mouseout', cs.mouse.eventUp)
   cs.canvas.addEventListener("touchstart", function(e) { cs.touch.eventDown(e);
      cs.sound.enable() }, false)
   cs.canvas.addEventListener("touchend", cs.touch.eventUp, false)
   cs.canvas.addEventListener("touchcancel", cs.touch.eventUp, false)
   cs.canvas.addEventListener("touchmove", cs.touch.eventMove, false)

   // View, Game and GUI surfaces
   cs.surface.create({ name: 'gui', raw: true, depth: 0 })
   cs.surface.create({ name: 'game', raw: false, depth: 10 })

   // Camera/View Size
   cs.surface.resize()
   cs.camera.resize()

   // Sound
   //cs.sound.active = cs.sound.init();
   window.onfocus = function() { cs.sound.toggleActive(true) }
   window.onblur = function() { cs.sound.toggleActive(false) }

   // watch for resizing
   window.onresize = function() {
      cs.camera.resize()
      cs.surface.resize()
   }

   // Sprites/Storage/Sound
   cs.sprite.init()
   cs.storage.init()
   cs.sound.init()

   // room/camera
   cs.room.setup({
      width: cs.canvas.getBoundingClientRect().width,
      height: cs.canvas.getBoundingClientRect().height
   })

   cs.camera.setup({
      width: cs.canvas.getBoundingClientRect().width,
      height: cs.canvas.getBoundingClientRect().height
   })

   // Start your engines!
   cs.start()
   cs.loop.step()
}
