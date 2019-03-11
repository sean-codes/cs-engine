cs.loop = {
   run: false,
   endSteps: [],
   beforeSteps: [],
   speed: 1000 / 60,
   id: 0,

   step: function(once) {
      this.id += 1

      setTimeout(function() { cs.loop.step() }, this.speed)
      if (!this.run && !once) return

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
         var objectType = cs.objects[object.core.type]
         var drawOnceEvent = objectType.drawOnce
         var drawEvent = objectType.draw
         var shouldDraw = object.core.live && object.core.active

         if (shouldDraw) {
            cs.draw.setSurface(object.core.surface)
            if (cs.surface.list[object.core.surface].clear) {
               drawOnceEvent && drawOnceEvent.call(object, object)
            }
            drawEvent && drawEvent.call(object, object)
         }
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
