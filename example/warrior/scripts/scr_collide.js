cs.script.collide = {
   obj: function(obj1, objtype){
      var i = cs.obj.list.length; while(i--){
         var obj2 = cs.obj.list[i]
         if (obj2.core.live !== true || obj2.core.id == obj1.id || obj2.core.type !== objtype)
            continue

         if(!this.rectInRect(
            { x: obj1.x+obj1.mask.x, y: obj1.y+obj1.mask.y, width: obj1.mask.width, height: obj1.mask.height },
            { x: obj2.x+obj2.mask.x, y: obj2.y+obj2.mask.y, width: obj2.mask.width, height: obj2.mask.height }))
            continue

         return obj2
      }
      return undefined
   },
   rect: function(objtype, options){
      var i = cs.obj.list.length; while(i--){
         var obj = cs.obj.list[i];
         //Damn this is kind of creepy looking :]
         if(obj.core.live === true && (obj.core.type == objtype || objtype == '')){
            if(options.x + options.width > obj.x && options.x < obj.x + obj.mask.width
               && options.y + options.height > obj.y && options.y < obj.y + obj.mask.height)
                  return obj;
         }
      }
      return undefined;
   },
   rectInRect(rect1, rect2){
      if(rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x ||
         rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y)
         return false
      return true
   }
}
