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

         var headless = this.cs.headless

         if (!headless) {
            this.cs.draw.debugReset()

            this.cs.surface.clearAll()

            // input
            this.cs.inputKeyboard.execute()
            this.cs.inputTouch.batchDownMove()
            // move camera before clear
            this.cs.camera.update()

         }

         this.cs.fps.update()
         this.cs.network.read()

         this.cs.object.addNewObjects()

         // Execute before steps
         // disconnect to allow adding within a beforestep
         var temporaryBeforeSteps = []
         while (this.beforeSteps.length) { temporaryBeforeSteps.push(this.beforeSteps.pop()) }
         while (temporaryBeforeSteps.length) { temporaryBeforeSteps.pop()() }

         this.cs.userStep && this.cs.userStep({ cs: this.cs })

         this.cs.object.loop((object) => {
            if (!object.core.active || !object.core.live) return
            object.step && object.step({ object, cs: this.cs })
         })

         if (!headless) {
            this.cs.userDraw && this.cs.userDraw({ cs: this.cs })

            this.cs.object.loop((object) => {
               if (!object.core.active || !object.core.live) return
               var template = this.cs.objects[object.core.type]
               var drawFunction = template.draw
               var drawOnceFunction = template.drawOnce

               this.cs.draw.setSurface(object.core.surface)

               if (object.drawOnce) {
                  var surface = this.cs.surface.list[object.core.surface]
                  if (surface.clear || !object.core.drawn) {
                     object.core.drawn = true
                     object.drawOnce({ object, cs: this.cs })
                  }
               }

               object.draw && object.draw({ object, cs: this.cs })
            })
         }

         // timers
         this.cs.timer.loop()

         if (!headless) {
            // Touch / Keyboard
            this.cs.surface.displayAll()
            this.cs.inputKeyboard.reset()
            this.cs.inputTouch.reset()
            this.cs.inputTouch.batchUp()
         }

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