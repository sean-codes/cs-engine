cs.loop = {
   run: true,
   endSteps: [],
   beforeSteps: [],
   speed: 1000 / 60,
   id: 0,

   step: function() {
      this.id += 1

      setTimeout(function() { cs.loop.step() }, this.speed)
      // requestAnimationFrame(cs.loop.step.bind(this))
      if (!this.run) return

      cs.fps.update()
      cs.key.execute()
      cs.draw.debugReset()

      // move camera before clear
      cs.camera.update()
      cs.surface.clearAll()
      cs.object.addNewObjects()

      // Execute before steps
      // disconnect to allow adding within a beforestep
      var temporaryBeforeSteps = []
      while(this.beforeSteps.length){ temporaryBeforeSteps.push(this.beforeSteps.pop()) }
      while (temporaryBeforeSteps.length) { temporaryBeforeSteps.pop()() }

      cs.object.loop(function(object) {
         var stepEvent = cs.objects[object.core.type].step
         cs.draw.setSurface(object.core.surface)
         object.core.live && stepEvent && stepEvent.call(object, object);
      })

      cs.object.loop(function(object) {
         var drawEvent = cs.objects[object.core.type].draw
         var shouldDraw = drawEvent && object.core.live && object.core.active
         shouldDraw && cs.draw.setSurface(object.core.surface)
         shouldDraw && drawEvent.call(object, object)
      })



      // timers
      cs.timer.loop()

      // Touch / Keyboard
      cs.key.reset()
      cs.touch.reset()

      // Resize Canvas
      cs.surface.displayAll()
      if (cs.room.restarting === true)
         cs.room.reset()

      // Execute next steps
      while (this.endSteps.length) {
         this.endSteps.pop()()
      }

      // could clearup !live objects here
      cs.object.clean()
   },

   endStep: function(func) {
      this.endSteps.push(func)
   },

   beforeStep: function(func) {
      this.beforeSteps.push(func)
   },

   stop: function() {
      this.run = false
   },

   start: function() {
      this.run = true
   }
}
