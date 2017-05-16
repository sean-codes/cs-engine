cs.script.fillBar = function(options){
   //Draw outside rect
   cs.draw.rect(options.x, options.y, options.width, options.height, true)

   //Draw inside rect at percentage
   cs.draw.setColor(options.color)
   var width = Math.ceil(options.width * options.percent)
   cs.draw.rect(options.x+1, options.y+1, width-2, options.height-2, true)
}
