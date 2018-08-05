//---------------------------------------------------------------------------------------------//
//-------------------------------| Touch Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.touch = {
   list : [],
   add : function(id){
      cs.sound.enable();
      for(var i = 0; i < cs.touch.list.length; i++)
         if(cs.touch.list[i].used === false) break

      cs.touch.list[i] = {
         used: false,
         down: true,
         up: false,
         x: 0,
         y: 0,
         id: id
      }
   },
   remove : function(id){
      for(var i = 0; i < cs.touch.list.length; i++){
         if(cs.touch.list[i].id == id){
            cs.touch.list[i].used = false
            cs.touch.list[i].down = false
            cs.touch.list[i].up = true
         }
      }
   },
   down: function(e){
      cs.touch.add(e.changedTouches[0].identifier)
      cs.touch.move(e)
   },
   up: function(e){
      var id = e.changedTouches[0].identifier;
      cs.touch.remove(id);
   },
   updatePos : function(id, x, y){
      for(var i = 0; i < cs.touch.list.length; i++){
         var touch = cs.touch.list[i]
         if(touch.id == id){
             touch.x = x
             touch.y = y
             return { x: touch.x, y: touch.y }
         }
      }
   },
   move: function(e){
      e.preventDefault();
      for(var i = 0; i < e.changedTouches.length; i++){
         var etouch = e.changedTouches[i]
         cs.touch.updatePos(etouch.identifier, etouch.clientX, etouch.clientY);
      }
   },
   create : function(raw){
      return {
         down : false,
         held : false,
         up : false,
         x : 0, y : 0,
         offsetX : 0, offsetY : 0,
         id : -1,
         within : function(arg){
            if(typeof arg.width == 'undefined') arg.width = arg.size || 0
            if(typeof arg.height == 'undefined') arg.height = arg.size || 0
            return (this.x > arg.x && this.x < arg.x+arg.width
                 && this.y > arg.y && this.y < arg.y+arg.height);
         },
         check : function(arg){
            if(this.id !== -1){
               // Move the current touch associated with that ID
               var touch = cs.touch.list[this.id]
               this.x = touch.x
               this.y = touch.y
               if(!cs.draw.raw){
                  convert = cs.touch.convertToGameCords(this.x, this.y)
                  this.x = convert.x; this.y = convert.y
               }
               this.down = touch.down
               this.held = touch.held
               this.up = touch.up;
               if(this.up){
                  touch.used = false
                  this.held = false
                  this.id = -1
               }
            } else {
               this.up = false;
               for(var i = 0; i < cs.touch.list.length; i++){
                  var ctouch = cs.touch.list[i]

                  this.x = ctouch.x
                  this.y = ctouch.y

                  if(!cs.draw.raw){
                     convert = cs.touch.convertToGameCords(this.x, this.y)
                     this.x = convert.x; this.y = convert.y
                  }

                  if(ctouch.down === true && ctouch.used === false){
                     if(this.x > arg.x && this.x < arg.x+arg.width
                        && this.y > arg.y && this.y < arg.y+arg.height){
                        //Being Touched
                        ctouch.used = true
                        this.down = true
                        this.id = i

                        this.offsetX = this.x-arg.x
                        this.offsetY = this.y-arg.y
                     }
                  }
               }
            }
         }
      }
   },
   reset : function(){
      for(var i = 0; i < cs.touch.list.length; i++){
         if(cs.touch.list[i].down === true){
            cs.touch.list[i].down = false;
            cs.touch.list[i].held = true;
         }
         cs.touch.list[i].up = false;
      }
   },
   convertToGameCords(x, y){
      var rect = cs.canvas.getBoundingClientRect();

      var physicalViewWidth = (rect.right-rect.left)
      var physicalViewHeight = (rect.bottom-rect.top)
      var hortPercent = (x - rect.left)/physicalViewWidth
      var vertPercent = (y - rect.top)/physicalViewHeight
      var gamex = Math.round(hortPercent*cs.camera.width)
      var gamey = Math.round(vertPercent*cs.camera.height)
      gamex = (gamex) + cs.camera.x
      gamey = (gamey) + cs.camera.y
      return { x: gamex, y: gamey }
   }
}
