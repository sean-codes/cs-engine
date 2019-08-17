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
            if (timer.time) timer.time += 1

            timer.percent = timer.time / timer.duration

            if (timer.percent === 1) {
               timer.running = false
               this.unWatch(timer)
               if (timer.end) timer.end()
            }
         })
      }

      create(options) {
         this.count += 1

         return {
            id: this.count,
            start: options.start,
            end: options.end,
            duration: options.duration,
            time: 0,
            percent: 0,
         }
      }

      start(timer) {
         if (timer.running) return false

         this.watch(timer)
         if (timer.start) timer.start()
         timer.running = true
         timer.time = 1
         timer.percent = 0

         return true
      }

      watch(timer) {
         this.list.push(timer)
      }

      unWatch(timer) {
         this.list = this.list.filter(num => num.id !== timer.id)
      }

      isOn(timer) {
         return timer.running
      }
   }

   // export (node / web)
   if (typeof module !== 'undefined') module.exports = CSENGINE_TIMER
   else cs.timer = new CSENGINE_TIMER(cs) // eslint-disable-line no-undef
})()
