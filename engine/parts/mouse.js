//---------------------------------------------------------------------------------------------//
//-------------------------------| Mouse Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.mouse = {
   x: undefined,
   y: undefined,
   pos: function() {
      var convert = cs.touch.convertToGameCords(cs.mouse.x, cs.mouse.y)
      return (cs.draw.raw)
         ? { x: cs.mouse.x, y: cs.mouse.y }
         : { x: convert.x, y: convert.y }
   },
   eventDown: function(e) {
      cs.touch.touchUse(-1)
      cs.mouse.x = e.clientX
      cs.mouse.y = e.clientY

      cs.touch.eventsDownMove.push({
         type: 'down',
         id: -1,
         x: cs.mouse.x,
         y: cs.mouse.y
      })

      cs.mouse.eventMove(e)
   },

   eventMove: function(e) {
      cs.mouse.x = e.clientX
      cs.mouse.y = e.clientY

      cs.touch.eventsDownMove.push({
         type: 'move',
         id: -1,
         x: cs.mouse.x,
         y: cs.mouse.y
      })
   },

   eventUp: function(e) {
      cs.touch.eventsUp.push({
         type: 'up',
         id: -1
      })
   }
}
