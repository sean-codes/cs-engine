//---------------------------------------------------------------------------------------------//
//-------------------------------| Mouse Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
class CSENGINE_INPUT_MOUSE {
   constructor(cs) {
      this.cs = cs

      this.x = undefined
      this.y = undefined
   }
   
   pos() {
      var convert = this.cs.touch.convertToGameCords(this.x, this.y)
      return (cs.draw.raw)
         ? { x: this.x, y: this.y }
         : { x: convert.x, y: convert.y }
   }

   eventDown(e) {
      this.cs.touch.touchUse(-1)
      this.x = e.clientX
      this.y = e.clientY

      this.cs.touch.eventsDownMove.push({
         type: 'down',
         id: -1,
         x: this.x,
         y: this.y
      })

      this.eventMove(e)
   }

   eventMove(e) {
      this.x = e.clientX
      this.y = e.clientY

      this.cs.touch.eventsDownMove.push({
         type: 'move',
         id: -1,
         x: this.x,
         y: this.y
      })
   }

   eventUp(e) {
      this.cs.touch.eventsUp.push({
         type: 'up',
         id: -1
      })
   }
}

if (module) module.exports = CSENGINE_INPUT_MOUSE
