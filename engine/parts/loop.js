cs.loop = {
   run: true,
   endSteps: [],
   beforeSteps: [],
   speed: 1000 / 60,
   id: 0,
   step: function() {
      this.id += 1
      if (!cs.loop.run) return
      setTimeout(function() { cs.loop.step() }, this.speed)
      // requestAnimationFrame(cs.loop.step.bind(this))
      cs.fps.update()
      cs.key.execute()
      cs.draw.debugReset()
      cs.camera.update()
      cs.surface.clearAll()
      cs.object.addNewObjects()

      // Execute before steps
      // disconnect to allow adding within a beforestep
      var temporaryBeforeSteps = []
      while(this.beforeSteps.length){ temporaryBeforeSteps.push(this.beforeSteps.pop()) }
      while (temporaryBeforeSteps.length) { temporaryBeforeSteps.pop()() }

      var i = cs.object.list.length;
      while (i--) {
         var obj = cs.object.list[i];
         var step = cs.objects[obj.core.type].step
         cs.draw.setSurface(obj.core.surface)
         obj.core.live && step && step.call(obj, obj);
      }

      var i = cs.object.list.length;
      while (i--) {
         var obj = cs.object.list[i]
         var draw = cs.objects[obj.core.type].draw
         cs.draw.setSurface(obj.core.surface)
         obj.core.live && obj.core.active && draw && draw.call(obj, obj)
      }

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
   }
}
