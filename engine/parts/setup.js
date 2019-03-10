cs.setup = function() {
   // Listen for Errors
   window.onerror = function(errorMsg, url, lineNumber) { cs.loop.run = false }

   // Initiate Inputs
   cs.ctx = this.canvas.getContext('2d')
   cs.canvas.tabIndex = 1000
   cs.canvas.style.outline = 'none'
   cs.canvas.addEventListener('keydown', cs.key.eventDown)
   cs.canvas.addEventListener('keyup', cs.key.eventUp)
   cs.canvas.addEventListener('mousemove', cs.mouse.eventMove)
   cs.canvas.addEventListener('mousedown', function(e) {
      cs.mouse.eventDown(e);
      cs.sound.enable()
   })
   cs.canvas.addEventListener('mouseup', cs.mouse.eventUp)
   cs.canvas.addEventListener('mouseout', cs.mouse.eventUp)
   cs.canvas.addEventListener("touchstart", function(e) {
      cs.touch.eventDown(e);
      cs.sound.enable()
   }, false)
   cs.canvas.addEventListener("touchend", cs.touch.eventUp, false)
   cs.canvas.addEventListener("touchcancel", cs.touch.eventUp, false)
   cs.canvas.addEventListener("touchmove", cs.touch.eventMove, false)

   // View, Game and GUI surfaces
   cs.surface.create({ name: 'gui', raw: true, depth: 0 })
   cs.surface.create({ name: 'game', raw: false, depth: 10 })

   // Sound
   //cs.sound.active = cs.sound.init();
   window.onfocus = function() {
      cs.focus(true)
      cs.sound.toggleActive(true)
   }

   window.onblur = function() {
      cs.focus(false)
      cs.sound.toggleActive(false)
   }

   // watch for resizing
   cs.resize = function() {
      cs.canvas.width = cs.fullscreen ? window.innerWidth : cs.canvas.clientWidth
      cs.canvas.height = cs.fullscreen ? window.innerHeight : cs.canvas.clientHeight

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

   // bootstrapping
   cs.start()
   window.onresize = cs.resize
   cs.resize()

   cs.loop.step()
   cs.loop.run = true
}
