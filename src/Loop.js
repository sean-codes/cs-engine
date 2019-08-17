// -------------------------------------------------------------------------- //
// -----------------------------| CS ENGINE: LOOP |-------------------------- //
// -------------------------------------------------------------------------- //

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
         const now = Date.now()
         this.delta = (now - this.last) / this.speed
         this.last = now

         if (!this.run || once) return
         this.timeout = setTimeout(() => this.step(), this.speed)

         const { headless } = this.cs

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
         const temporaryBeforeSteps = []
         while (this.beforeSteps.length) { temporaryBeforeSteps.push(this.beforeSteps.pop()) }
         while (temporaryBeforeSteps.length) { temporaryBeforeSteps.pop()() }

         if (this.cs.userStep) this.cs.userStep({ cs: this.cs })

         this.cs.object.loop((object) => {
            if (!object.core.active || !object.core.live) return
            if (!headless) this.cs.draw.setSurface(object.core.surface)
            if (object.step) object.step({ object, cs: this.cs })
         })

         if (!headless) {
            if (this.cs.userDraw) this.cs.userDraw({ cs: this.cs })

            this.cs.object.loop((object) => {
               if (!object.core.active || !object.core.live) return
               this.cs.draw.setSurface(object.core.surface)

               if (object.drawOnce) {
                  const surface = this.cs.surface.list[object.core.surface]
                  if (surface.clear || !object.core.drawn) {
                     object.core.drawn = true
                     object.drawOnce({ object, cs: this.cs })
                  }
               }

               if (object.draw) object.draw({ object, cs: this.cs })
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
         this.timeout = setTimeout(() => this.step(), this.speed)
      }

      stop() {
         this.run = false
         clearTimeout(this.timeout)
      }
   }

   // export (node / web)
   if (typeof module !== 'undefined') module.exports = CSENGINE_LOOP
   else cs.loop = new CSENGINE_LOOP(cs) // eslint-disable-line no-undef
})()
