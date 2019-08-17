// -------------------------------------------------------------------------- //
// -----------------------------| CS ENGINE: FPS |--------------------------- //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_FPS {
      constructor(cs) {
         this.cs = cs

         this.rate = 0
         this.frame = 0
         this.check = Date.now()
      }

      update() {
         if (this.checkReset()) this.frame += 1
         else this.reset()
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

   // export (node / web)
   if (typeof module !== 'undefined') module.exports = CSENGINE_FPS
   else cs.fps = new CSENGINE_FPS(cs) // eslint-disable-line no-undef
})()
