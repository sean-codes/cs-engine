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
               if (timer.onEnd) timer.onEnd()
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
         timer.time = 1
         timer.percent = 0
         this.watch(timer)

         return true
      }

      reset(timer) {
         if (!timer.running) {
            return this.start(timer)
         }

         timer.time = 1
         timer.percent = 0
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
