cs.script.collide = {
   obj: function(obj1, objtype){
      var i = cs.obj.list.length; while(i--){
         var obj2 = cs.obj.list[i]
         if (obj2.live !== true || obj2.id == obj1.id || obj2.type !== objtype)
            continue

         if(!this.rectInRect(
            { x: obj1.x, y: obj1.y, width: obj1.width, height: obj1.height },
            { x: obj2.x, y: obj2.y, width: obj2.width, height: obj2.height }))
            continue

         return obj2
      }
      return undefined
   },
   rect: function(objtype, options){
      var i = cs.obj.list.length; while(i--){
         var obj = cs.obj.list[i];
         //Damn this is kind of creepy looking :]
         if(obj.live === true && (obj.type == objtype || objtype == '')){
            if(options.x + options.width > obj.x && options.x < obj.x + obj.width
               && options.y + options.height > obj.y && options.y < obj.y + obj.height)
                  return obj;
         }
      }
      return undefined;
   },
   rectInRect(rect1, rect2){
      if(rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x ||
         rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y )
         return false
      return true
   }
}
