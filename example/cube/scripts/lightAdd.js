cs.script.lightAdd = function(objID, color, radius, xoff, yoff) {
   var len = cs.global.lightList.length;
   cs.global.lightList[len] = {
      obj: objID,
      color: color,
      size: radius,
      xoff: xoff,
      yoff: yoff
   }
}
