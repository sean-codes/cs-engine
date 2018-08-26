//---------------------------------------------------------------------------------------------//
//-------------------------------| Mouse Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.mouse = {
   x: undefined,
	y: undefined,
   pos : function(){
      var convert = cs.touch.convertToGameCords(cs.mouse.x, cs.mouse.y)
      return (cs.draw.raw)
         ? {x: cs.mouse.x, y: cs.mouse.y}
         : {x: convert.x, y: convert.y}
   },
   eventMove : function(e){
		cs.mouse.x = e.clientX
		cs.mouse.y = e.clientY
      cs.touch.updatePos({ id: -1, x: cs.mouse.x, y: cs.mouse.y })
   },
   eventDown : function(e){
      cs.touch.touchUse(-1)
		cs.touch.updatePos({ id: -1, x: e.clientX, y: e.clientY })
   },
   eventUp : function(e){
      cs.touch.touchUnuse(-1)
   }
}
