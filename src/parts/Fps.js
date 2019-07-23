class CSENGINE_FPS {
   constructor(cs) {
      this.cs = cs

      this.rate = 0
      this.frame = 0
      this.check = Date.now()
   }

   update() {
      this.checkReset() ? this.frame += 1 : this.reset()
   }

   checkReset() {
      return Date.now() - this.check < 1000
   }

   reset() {
      this.check = Date.now()
      this.rate = this.frame
      this.frame = 0
   }
}

if (module) module.exports = CSENGINE_FPS
