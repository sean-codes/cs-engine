cs.setup = function(){
   // Listen for Errors
   window.onerror = function(errorMsg, url, lineNumber){ cs.loop.run = false }

   // Initiate Inputs
   cs.ctx = this.canvas.getContext('2d')
	cs.canvas.tabIndex = 1000
   cs.canvas.addEventListener('keydown', cs.key.updateDown)
   cs.canvas.addEventListener('keyup', cs.key.updateUp)
   cs.canvas.addEventListener('mousemove', cs.mouse.move)
   cs.canvas.addEventListener('mousedown', cs.mouse.down)
   cs.canvas.addEventListener('mouseup', cs.mouse.up)
	cs.canvas.addEventListener('mouseout', cs.mouse.up)
   cs.canvas.addEventListener("touchstart", cs.touch.down, false)
   cs.canvas.addEventListener("touchend", cs.touch.up, false)
   cs.canvas.addEventListener("touchcancel", cs.touch.up, false)
   cs.canvas.addEventListener("touchmove", cs.touch.move, false)

   // View, Game and GUI surfaces
   cs.surface.create({ name: 'gui', raw: true, depth: 0 })
   cs.surface.create({ name: 'game', raw: false, depth: 10 })

   // Camera/View Size
   cs.surface.resize()

   // Sound
   //cs.sound.active = cs.sound.init();
   window.onfocus = function(){ cs.sound.toggleActive(true) }
   window.onblur = function(){ cs.sound.toggleActive(false) }

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
