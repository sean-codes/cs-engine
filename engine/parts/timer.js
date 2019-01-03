cs.timer = {
   list: [],
   count: 0,
   loop: function() {
      for (var timer of this.list) {
         if(timer.time) timer.time += 1

         timer.percent = timer.time / timer.duration

         if(timer.percent == 1) {
            timer.running = false

            this.unWatch(timer)
            timer.end && timer.end()
         }
      }
   },

   add: function(options) {
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
   },

   start: function(timer) {
      if (timer.running) return

      this.watch(timer)
      timer.start && timer.start()
      timer.running = true
      timer.time = 1
   },

   watch: function(timer) {
      this.list.push(timer)
   },

   unWatch: function(timer) {
      this.list = this.list.filter(function(num) {
         return num.id !== timer.id
      })
   },

   isOn: function(timer) {
      return timer.time > 0
   }
}
