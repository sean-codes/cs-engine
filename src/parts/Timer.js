//----------------------------------------------------------------------------//
//------------------------------| CS ENGINE: TIMER |--------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_TIMER {
      constructor(cs) {
         this.cs = cs

         this.list = []
         this.count = 0
      }

      loop() {
         for (var timer of this.list) {
            if(timer.time) timer.time += 1

            timer.percent = timer.time / timer.duration

            if(timer.percent == 1) {
               timer.running = false

               this.unWatch(timer)
               timer.end && timer.end()
            }
         }
      }

      create(options) {
         var timer = options.timer
         if(!timer) {
            this.count += 1

            timer = {
               id: this.count,
               start: options.start,
               end: options.end,
               duration: options.duration,
               time: 0,
               percent: 0
            }
         }


         //this.list.push(timer)
         return timer
      }

      start(timer) {
         if (timer.running) return

         this.watch(timer)
         timer.start && timer.start()
         timer.running = true
         timer.time = 1
      }

      watch(timer) {
         this.list.push(timer)
      }

      unWatch(timer) {
         this.list = this.list.filter(function(num) {
            return num.id !== timer.id
         })
      }

      isOn(timer) {
         return timer.time > 0
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_TIMER
      : cs.timer = new CSENGINE_TIMER(cs)
})()
