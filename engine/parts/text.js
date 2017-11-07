//---------------------------------------------------------------------------------------------//
//------------------------------------| Text Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
// Possible Text Sprites for the future

cs.text = {
   list: {},
   create: function(options){
      var text = {
         text: options.text,
         width: options.width,
         height: undefined,
         lineHeight: options.lineHeight,
         ctx: document.createElement('canvas').getContext('2d')
      }

      this.list[options.name] = this.setup(text)
   },
   setup: function(text){
      // Setup and Draw Lines
      this.setupLines(text)
      this.drawLines(text)

      return text
   },
   setupLines: function(text){
      // Guessing the size
      var lines = []
      var curLine = []
      var y = 0, x = 0
      var textArr = text.text.split('')

      // Setup the lines
      for(var pos in textArr){
         curLine.push(textArr[pos])

         if(text.ctx.measureText(curLine.join('')).width >= text.width){
            // Try to find a space
            for(var o = curLine.length; o > 0; o--)
               if(curLine[o] == ' ') break

            // If no space add a dash
            if(!o){
               o = curLine.length-2
               curLine.splice(o-1, 0, '-')
            }

            // Draw and reset
            lines.push(curLine.slice(0, o).join('').trim())
            curLine = curLine.slice(o, curLine.length)
            y += text.lineHeight
         }
         if(pos == textArr.length-1){
            lines.push(curLine.join('').trim())
         }
      }

      text.width = text.width,
      text.height = lines.length * text.lineHeight,
      text.lines = lines
   },
   drawLines(text){
      text.ctx.canvas.width = text.width,
      text.ctx.canvas.height = text.height
      text.ctx.textBaseline = 'top'

      for(var line in text.lines){
         text.ctx.fillText(text.lines[line], 0, line * text.lineHeight)
      }
   },
   info: function(name){
      return this.list[name]
   }
}
