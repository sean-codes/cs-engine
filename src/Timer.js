// --------------------------------------------------------------------------- //
// ------------------------------| CS ENGINE: TIMER |------------------------- //
// --------------------------------------------------------------------------- //

(() => {
   class CSENGINE_TIMER {
      constructor(cs) {
         this.cs = cs

         this.list = []
         this.count = 0
      }

      loop() {
         this.list.forEach(timer => {
            timer.time += 1
            timer.left -= 1
            timer.percent = Math.min(timer.time / timer.duration, 1)

            if (timer.percent >= 1) {
               this.end(timer)
            }
         })
      }

      create(options) {
         this.count += 1

         const timer = {
            id: this.count,
            onStart: options.onStart,
            onEnd: options.onEnd,
            duration: options.duration,
            time: 0,
            left: 0,
            percent: 0,
            running: false
         }

         if (options.start) {
            this.start(timer)
         }

         return timer
      }

      start(timer) {
         if (timer.running) return false

         if (timer.onStart) timer.onStart()
         timer.running = true
         timer.time = 0
         timer.left = timer.duration
         timer.percent = 0
         this.watch(timer)

         return true
      }

      reset(timer) {
         if (!timer.running) {
            return this.start(timer)
         }

         timer.time = 0
         timer.left = timer.duration
         timer.percent = 0
      }

      end(timer) {
         timer.running = false
         timer.time = timer.duration
         timer.left = 0

         this.unWatch(timer)
         if (timer.onEnd) timer.onEnd()
      }

      watch(timer) {
         this.list.push(timer)
      }

      unWatch(timer) {
         this.list = this.list.filter(t => t.id !== timer.id)
      }

      isOn(timer) {
         return timer.running
      }
   }

   // export (node / web)
   if (typeof cs === 'undefined') module.exports = CSENGINE_TIMER
   else cs.timer = new CSENGINE_TIMER(cs) // eslint-disable-line no-undef
})()
