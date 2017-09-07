//---------------------------------------------------------------------------------------------//
//------------------------------------| Text Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.text = {
   list: [],
   create: function(options){
      var text = {
         text: options.text,
         width: options.width,
         height: undefined,
         lineHeight: options.lineHeight,
         ctx: document.createElement('canvas').getContext('2d')
      }

      list[options.name] = text
   },
   setup: function(text){
      // Guessing the size
      text.ctx.canvas.width = text.width
      text.ctx.canvas.height = text.ctx.measureText(text.text).width / text.width * text.lineHeight

      var curLine = []
      var y = 0
      var x = 0
      var tempText = text.text.split('')// Making this an array so I can use splice
      for(var pos in tempText){
         curLine.push(tempText[pos])

         if(text.ctx.measureText(curLine.join('')).width >= options.width){
            // Try to find a space
            for(var o = curLine.length; o > 0; o--)
               if(curLine[o] == ' ') break

            // If no space add a dash
            if(!o){
               o = curLine.length-2
               curLine.splice(o-1, 0, '-')
            }

            // Draw and reset
            text.ctx.fillText(curLine.slice(0, o).join('').trim(), x, y)
            curLine = curLine.slice(o, curLine.length)
            y += text.lineHeight
         }
         if(pos == tempText.length-1){
            text.ctx.fillText(curLine.join(''), x, y)
         }
      }
      text.height = y + text.lineHeight
   }
}
