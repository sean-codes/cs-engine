// -------------------------------------------------------------------------- //
// -----------------------------| CS ENGINE: ROOM |-------------------------- //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_ROOM {
      constructor(cs) {
         this.cs = cs

         this.width = cs.default(cs.options.room && cs.options.room.width, 100)
         this.height = cs.default(cs.options.room && cs.options.room.width, 100)
         this.rect = {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
         }
      }

      setup(info) {
         this.width = info.width
         this.height = info.height
         if (info.background) this.cs.canvas.style.background = info.background
         this.rect = { x: 0, y: 0, width: this.width, height: this.height }
         this.cs.resize()
      }

      outside(rect) {
         const width = this.cs.default(rect.width, 0)
         const height = this.cs.default(rect.height, 0)

         return (
            rect.x < 0
            || rect.y < 0
            || rect.x + width > this.width
            || rect.y + height > this.height
         )
      }
   }

   // export (node / web)
   if (typeof module !== 'undefined') module.exports = CSENGINE_ROOM
   else cs.room = new CSENGINE_ROOM(cs) // eslint-disable-line no-undef
})()
