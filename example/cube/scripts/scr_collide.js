cs.script.collide = function(that, objtype, options){
   if(options == undefined) options = {}
   var vspeed = that.vspeed || 0; var hspeed = that.hspeed;
   vspeed = (options.vspeed !== undefined) ? options.vspeed : that.vspeed || 0;
   hspeed = (options.hspeed !== undefined) ? options.hspeed : that.hspeed || 0;
   var obj1top = (options.y || that.y) - that.yoff + vspeed;
   var obj1bottom = obj1top + (options.height || that.height);
   var obj1left = (options.x || that.x) - that.xoff + hspeed;
   var obj1right = obj1left + (options.width || that.width);
   var i = cs.obj.list.length; while(i--){
      var obj2 = cs.obj.list[i];
      if (obj2.live === true && i !== that.id && obj2.type == objtype){
           var obj2top = obj2.y;
           var obj2bottum = obj2.y + obj2.height;
           var obj2left = obj2.x;
           var obj2right = obj2.x + obj2.width;

           if (obj1bottom > obj2top && obj1top < obj2bottum &&
               obj1left < obj2right && obj1right > obj2left){
               return obj2;
           }
      }
   }
   return undefined;
}
