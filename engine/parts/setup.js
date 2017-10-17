cs.setup = function(){
   // Listen for Errors
   window.onerror = function(errorMsg, url, lineNumber){ cs.loop.run = false }

   // Initiate Inputs
   cs.view = document.getElementById(cs.view)
   cs.view.ctx = cs.view.getContext('2d')
   cs.view.tabIndex = 1000
   cs.view.addEventListener('keydown', cs.key.updateDown)
   cs.view.addEventListener('keyup', cs.key.updateUp)
   cs.view.addEventListener('mousemove', cs.mouse.move)
   cs.view.addEventListener('mousedown', cs.mouse.down)
   cs.view.addEventListener('mouseup', cs.mouse.up)
   cs.view.addEventListener("touchstart", cs.touch.down, false)
   cs.view.addEventListener("touchend", cs.touch.up, false)
   cs.view.addEventListener("touchcancel", cs.touch.up, false)
   cs.view.addEventListener("touchmove", cs.touch.move, false)
   cs.input.create()

   // View, Game and GUI surfaces
   cs.surface.create({ name: 'gui', raw: true, depth: 0 })
   cs.surface.create({ name: 'game', raw: false, depth: 10 })

   // Camera/View Size
   cs.surface.resize()
   cs.input.resize()

   // Sound
   //cs.sound.active = cs.sound.init();
   window.onfocus = function(){ cs.sound.toggleActive(true) }
   window.onblur = function(){ cs.sound.toggleActive(false) }

   // Sprites/Storage/Sound
   cs.sprite.init()
   cs.storage.init()
   cs.sound.init()

   // Start your engines!
   cs.start()
   cs.loop.step()
}
