//---------------------------------------------------------------------------------------------//
//--------------------------------| Performance Monitoring |-----------------------------------//
//---------------------------------------------------------------------------------------------//
cs.fps = {
   rate: 0,
   frame: 0,
   check: Date.now(),
   update: function() {
      this.checkReset() ? this.frame += 1 : this.reset()
   },
   checkReset: function() {
      return Date.now() - this.check < 1000
   },
   reset: function() {
      this.check = Date.now()
      this.rate = this.frame
      this.frame = 0
   }
}
