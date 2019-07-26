//----------------------------------------------------------------------------//
//------------------------------| CS ENGINE: LOOP |---------------------------//
//----------------------------------------------------------------------------//
(() => {
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

         if (!this.run || once) return
         this.timeout = setTimeout(() => this.step(), this.speed)
         // window.requestAnimationFrame(() => this.step())
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

         // Execute before steps
         // disconnect to allow adding within a beforestep
         var temporaryBeforeSteps = []
         while(this.beforeSteps.length){ temporaryBeforeSteps.push(this.beforeSteps.pop()) }
         while (temporaryBeforeSteps.length) { temporaryBeforeSteps.pop()() }

         this.cs.userStep && this.cs.userStep({ cs })

         this.cs.object.loop((object) => {
            if (!object.core.active || !object.core.live) return
            var stepEvent = this.cs.objects[object.core.type].step
            stepEvent && stepEvent.call(object, { object, cs: this.cs })
         })

         this.cs.userDraw && this.cs.userDraw({ cs })

         this.cs.object.loop((object) => {
            if (!object.core.active || !object.core.live) return
            var template = this.cs.objects[object.core.type]
            var drawFunction = template.draw
            var drawOnceFunction = template.drawOnce

            this.cs.draw.setSurface(object.core.surface)

            if (drawOnceFunction) {
               var surface = this.cs.surface.list[object.core.surface]
               if (surface.clear || !object.core.drawn) {
                  object.core.drawn = true
                  drawOnceFunction.call(object, { object, cs: this.cs })
               }
            }

            drawFunction && drawFunction.call(object, { object, cs: this.cs })
         })

         // timers
         this.cs.timer.loop()

         // Touch / Keyboard
         this.cs.inputKeyboard.reset()
         this.cs.inputTouch.reset()
         this.cs.inputTouch.batchUp()

         this.cs.surface.displayAll()

         // Execute next steps
         while (this.endSteps.length) {
            this.endSteps.pop()()
         }

         // could clearup !live objects here
         this.cs.object.clean()

         // network metrics
         if (this.cs.network.status) {
            this.cs.network.updateMetrics()
         }
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

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_LOOP
      : cs.loop = new CSENGINE_LOOP(cs)
})()
