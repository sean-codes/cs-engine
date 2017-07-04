cs.script.collide = function(that, objtype, options){
   if(options == undefined) options = {}
   vspeed = (options.vspeed !== undefined) ? options.vspeed : that.vspeed || 0;
   hspeed = (options.hspeed !== undefined) ? options.hspeed : that.hspeed || 0;
   var obj1top = (options.y || that.y) + vspeed;
   var obj1bottom = obj1top + (options.height || that.height);
   var obj1left = (options.x || that.x) + hspeed;
   var obj1right = obj1left + (options.width || that.width);
   var i = cs.obj.list.length; while(i--){
      var obj2 = cs.obj.list[i]
      if (obj2.live !== true || obj2.id == that.id || obj2.type !== objtype)
         continue

      var obj2top = obj2.y;
      var obj2bottum = obj2.y + obj2.height;
      var obj2left = obj2.x;
      var obj2right = obj2.x + obj2.width;

      if(obj1bottom <= obj2top || obj1top >= obj2bottum || obj1left >= obj2right || obj1right <= obj2left)
         continue

      return obj2
   }
   return undefined
}

cs.script.collideRect = function(objtype, options){
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
}
