// -------------------------------------------------------------------------- //
// -------------------------| CS ENGINE: INPUT MOUSE |----------------------- //
// -------------------------------------------------------------------------- //
(() => {
   class CSENGINE_INPUT_MOUSE {
      constructor(cs) {
         this.cs = cs

         this.x = undefined
         this.y = undefined
      }

      pos() {
         const convert = this.cs.inputTouch.convertToGameCords(this.x, this.y)
         return (this.cs.draw.raw)
            ? { x: this.x, y: this.y }
            : { x: convert.x, y: convert.y }
      }

      eventDown(e) {
         this.cs.inputTouch.touchUse(-1)
         this.x = e.clientX / this.cs.width * this.cs.clampWidth
         this.y = e.clientY / this.cs.height * this.cs.clampHeight

         this.cs.inputTouch.eventsDownMove.push({
            type: 'down',
            id: -1,
            x: this.x,
            y: this.y,
         })

         this.eventMove(e)
      }

      eventMove(e) {
         this.x = e.clientX / this.cs.width * this.cs.clampWidth
         this.y = e.clientY / this.cs.height * this.cs.clampHeight

         this.cs.inputTouch.eventsDownMove.push({
            type: 'move',
            id: -1,
            x: this.x,
            y: this.y,
         })
      }

      eventUp() {
         this.cs.inputTouch.eventsUp.push({
            type: 'up',
            id: -1,
         })
      }
   }

   // export (node / web)
   if (typeof cs === 'undefined') module.exports = CSENGINE_INPUT_MOUSE
   else cs.inputMouse = new CSENGINE_INPUT_MOUSE(cs) // eslint-disable-line no-undef
})()
