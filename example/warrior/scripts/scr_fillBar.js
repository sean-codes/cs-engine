cs.script.fillBar = function(options){
   //Draw Border
   cs.draw.setAlpha(options.alpha || 1)
   cs.draw.rect(options.x, options.y, options.width, options.height, true)

   //Draw inside rect at percentage
   cs.draw.setAlpha(options.alpha || 1)
   cs.draw.setColor(options.color)
   var width = Math.ceil(options.width * (options.percent < 0 ? 0 : options.percent))
   cs.draw.rect(options.x+1, options.y+1, (width < 2 ? 2 : width) - 2, options.height-2, true)
}
