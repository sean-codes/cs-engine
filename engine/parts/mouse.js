//---------------------------------------------------------------------------------------------//
//-------------------------------| Mouse Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.mouse = {
   x: undefined, y: undefined,
   pos : function(){
      var convert = cs.touch.convertToGameCords(cs.mouse.x, cs.mouse.y)
      return (cs.draw.raw)
         ? {x: cs.mouse.x, y: cs.mouse.y}
         : {x: convert.x, y: convert.y}
   },
   move : function(e){
      var pos = cs.touch.updatePos(-1, e.clientX, e.clientY)
      cs.mouse.x = (pos) ? pos.x : 0
      cs.mouse.y = (pos) ? pos.y : 0
   },
   down : function(e){
      cs.touch.add(-1)
      cs.touch.updatePos(-1, e.clientX, e.clientY)
   },
   up : function(e){
      cs.touch.remove(-1)
   }
}
