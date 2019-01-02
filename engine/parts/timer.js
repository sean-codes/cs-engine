cs.timer = {
   list: [],
   count: 0,
   loop: function() {
      for (var timer of this.list) {
         if(timer.time) timer.time += 1
         if(!timer.time && timer.start()) timer.time = 1
         timer.percent = timer.time / timer.duration

         if(timer.percent == 1) {
            timer.end()
            this.remove(timer)
         }
      }
   },

   add: function(options) {
      var timer = options.timer
      if(!timer) {
         this.count += 1

         if(!options.start) {
            return console.error('cs.timer: need way to start timer')
         }

         timer = {
            id: this.count,
            start: options.start,
            end: options.end,
            duration: options.duration,
            time: 0,
            percent: 0
         }
      }


      this.list.push(timer)
      return timer
   },

   remove: function(timer) {
      this.list = this.list.filter(function(num) {
         return num.id !== timer.id
      })
   },

   isOn: function(timer) {
      return timer.time > 0
   }
}
