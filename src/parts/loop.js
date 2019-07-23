class CSENGINE_LOOP {
   constructor(cs) {
      this.cs = cs

      this.run = false
      this.endSteps = []
      this.beforeSteps = []
      this.speed = 1000 / 60
      this.last = Date.now()
      this.id = 0
      this.timeout = undefined
   }

   step(once) {
      this.id += 1

      // delta fixing
      var now = Date.now()
      this.delta = (now - this.last) / this.speed
      this.last = now

      if (!this.run && !once) return
      this.timeout = setTimeout(() => this.step(), this.speed)

      this.cs.fps.update()
      this.cs.draw.debugReset()
      this.cs.network.read()


      // move camera before clear
      this.cs.camera.update()
      this.cs.surface.clearAll()
      this.cs.object.addNewObjects()

      // input
      this.cs.inputKeyboard.execute()
      this.cs.inputTouch.batchDownMove()

      // // Execute before steps
      // // disconnect to allow adding within a beforestep
      // var temporaryBeforeSteps = []
      // while(this.beforeSteps.length){ temporaryBeforeSteps.push(this.beforeSteps.pop()) }
      // while (temporaryBeforeSteps.length) { temporaryBeforeSteps.pop()() }

      this.cs.userStep && this.cs.userStep()

      // this.cs.object.loop(function(object) {
      //    if (!object.core.active || !object.core.live) return
      //    var stepEvent = cs.objects[object.core.type].step
      //    cs.draw.setSurface(object.core.surface)
      //    stepEvent && stepEvent.call(object  , object);
      // })
      //
      this.cs.userDraw && this.cs.userDraw()
      // console.log(this)
      // this.cs.object.loop((object) => {
         // console.log('wtf')
         // if (!object.core.active || !object.core.live) return
         // var objectType = this.cs.objects[object.core.type]
         // var drawEvent = objectType.draw
         // var drawOnceEvent = objectType.drawOnce
         //
         // this.cs.draw.setSurface(object.core.surface)
         // if (drawOnceEvent) {
         //    if (this.cs.surface.list[object.core.surface].clear || !object.core.drawn) {
         //       object.core.drawn = true
         //       drawOnceEvent.call(object, object)
         //    }
         // }
         //
         // drawEvent && drawEvent.call(object, object)
      // })
      //
      // // timers
      // this.cs.timer.loop()
      //
      // // Touch / Keyboard
      // this.cs.key.reset()
      // this.cs.touch.reset()
      // this.cs.touch.batchUp()
      //
      // // Resize Canvas
      // this.cs.surface.displayAll()
      // if (this.cs.room.restarting === true)
      //    this.cs.room.reset()
      //
      // // Execute next steps
      // while (this.endSteps.length) {
      //    this.endSteps.pop()()
      // }
      //
      // // could clearup !live objects here
      // this.cs.object.clean()
      //
      // // network metrics
      // if (this.cs.network.status) {
      //    this.cs.network.updateMetrics()
      // }
   }

   beforeStep(func) {
      this.beforeSteps.push(func)
   }

   endStep(func) {
      this.endSteps.push(func)
   }

   start() {
      this.run = true
      this.step()
   }

   stop() {
      this.run = false
      clearTimeout(this.timeout)
   }
}

// export node
if (module) module.exports = CSENGINE_LOOP
