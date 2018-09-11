cs.loop = {
   run : true,
   endSteps: [],
   nextSteps: [],
	speed: 1000/60,
   step : function(){
      if(cs.loop.run)
         setTimeout(function(){ cs.loop.step() }, this.speed)

      cs.fps.update()
      cs.key.execute()
      cs.draw.debugReset()
      cs.camera.update()
      cs.surface.clearAll()
		cs.obj.addNewObjects()

		var i = cs.obj.list.length; while(i--){
			var obj = cs.obj.list[i];
			var step = cs.objects[obj.core.type].step
			cs.draw.setSurface(obj.core.surface)
			obj.core.live && step && step.call(obj, obj);
      }

		var i = cs.obj.list.length; while(i--) {
			var obj = cs.obj.list[i]
			var draw = cs.objects[obj.core.type].draw
			cs.draw.setSurface(obj.core.surface)
			obj.core.live && draw && draw.call(obj, obj)
		}

		// Touch / Keyboard
      cs.key.reset()
      cs.touch.reset()

      // Resize Canvas
      cs.surface.displayAll()
      if(cs.room.restarting === true)
         cs.room.reset()

      // Execute next steps
		while(this.endSteps.length) {
			this.endSteps.pop()()
		}

		// could clearup !live objects here
   },
   endStep: function(func){
      this.endSteps.push(func)
   }
}
