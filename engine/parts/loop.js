cs.loop = {
   run : true,
   endSteps: [],
   nextSteps: [],
   step : function(){
      if(cs.loop.run)
         setTimeout(function(){ cs.loop.step() }, 1000/60)

      cs.fps.update()
      cs.key.execute()
      cs.draw.debugReset()
      cs.camera.update()
      cs.surface.clearAll()
		cs.obj.addNewObjects()

		var i = cs.obj.list.length; while(i--){
         if(cs.obj.list[i].core.live){
            var obj = cs.obj.list[i];
				cs.draw.setSurface(obj.core.surface);
            var step = cs.objects[obj.core.type].step;
            step && step.call(obj);
         }
      }

		var i = cs.obj.list.length; while(i--) {
			if(cs.obj.list[i].core.live){
				var obj = cs.obj.list[i]
				cs.draw.setSurface(obj.core.surface)
				var draw = cs.objects[obj.core.type].draw
				draw && draw.call(obj)
			}
		}

		// Touch / Keyboard
      cs.key.reset()
      cs.touch.reset()

      // Resize Canvas
      cs.surface.checkResize()
      cs.surface.displayAll()
      if(cs.room.restarting === true)
         cs.room.reset()

      // Execute next steps
      var i = this.endSteps.length; while(i--){
         (!this.endSteps[i].next)
            ? this.endSteps.pop().func()
            : this.endSteps[i].next = false
      }

		// could clearup !live objects here
   },
   endStep: function(options){
      if(!options.next){ options.next = false }
      this.endSteps.push({ next: options.next, func: options.func })
   }
}
