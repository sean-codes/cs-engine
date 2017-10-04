//---------------------------------------------------------------------------------------------//
//----------------------------------| Drawing Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.draw = {
   ctx : undefined,
   canvas : { width: 0, height: 0 },
   alpha : 1,
   raw : false,
   height : 0,
   width : 0,
   fontSize : 10,
   lineHeight: 10,
   background: '#465',
   debug: {},
   w : 0,
   h : 0,
   o : 0,
   setting: {
      alpha: 1,
      width: 1,
      font: '12px Arial',
      textAlign: 'start',
      textBaseline: 'top',
      color: '#000',
      lineHeight: 10,
      operation: 'source-over'
   },
   debugReset: function(){
      this.debug = {
         skippedSprites: 0,
         drawnSprites: 0
      }
   },
   sprite : function(options){
      sprite = cs.sprite.list[options.spr]
      var info = cs.sprite.info(options)

      if(!this.raw && !this.skip && !options.noskip){
         //If outside camera skip
         if(options.x+sprite.fwidth < cs.camera.x || options.x  > cs.camera.x+cs.camera.width
         || options.y+sprite.fheight < cs.camera.y || options.y  > cs.camera.y+cs.camera.height ){
            this.debug.skippedSprites += 1
            return
         }
      }
      this.debug.drawnSprites += 1

      this.ctx.save();
      this.ctx.translate(Math.floor(options.x), Math.floor(options.y))
      this.ctx.rotate(options.angle * Math.PI/180)
      this.ctx.scale(info.scaleX+0.001, info.scaleY+0.001)
      this.ctx.drawImage(info.frames[info.frame], -sprite.xoff, -sprite.yoff)
      this.ctx.restore()
      this.settingsReset()
   },
   textInfo: function(options){
      // Guessing the size
      var lines = []
      var curLine = []
      var y = 0, x = 0
      var textArr = options.text.split('')

      // Setup the lines
      for(var pos in textArr){
         curLine.push(textArr[pos])

         if(this.ctx.measureText(curLine.join('')).width > options.width){
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
            y += options.lineHeight
         }
         if(pos == textArr.length-1){
            lines.push(curLine.join('').trim())
         }
      }

      return {
         lines: lines,
         lineHeight: options.lineHeight,
         width: options.width,
         height: lines.length * options.lineHeight,
      }
   },
   text: function(options){
      if(options.lines){
         for(var line in options.lines){
            this.ctx.fillText(options.lines[line], options.x, options.y + (line*(options.lineHeight || this.ctx.lineHeight)))
         }
      } else {
         this.ctx.fillText(options.text, options.x, options.y)
      }
      this.settingsReset()
   },
   textWidth: function(str){
      return this.ctx.measureText(str).width
   },
   line: function(options){
      var cx = 0 - ((this.ctx.lineWidth % 2 == 0) ? 0 : 0.50)
      var cy = 0 - ((this.ctx.lineWidth % 2 == 0) ? 0 : 0.50)

      this.ctx.beginPath();
      this.ctx.moveTo(options.x1-cx,options.y1-cy);
      this.ctx.lineTo(options.x2-cx,options.y2-cy);
      this.ctx.stroke()
      this.settingsReset()
   },
   fillRect: function(args){
      if(typeof args.width == 'undefined') args.width = args.size || 0
      if(typeof args.height == 'undefined') args.height = args.size || 0

      this.ctx.fillRect(args.x,args.y,args.width,args.height)
      this.settingsReset()
   },
   strokeRect: function(args){
      var lineWidth = this.ctx.lineWidth
      var lineWidthAdjust = lineWidth/2
      var rect = {
         x: args.x + lineWidthAdjust,
         y: args.y + lineWidthAdjust,
         width: (args.width ? args.width : args.size) - lineWidth,
         height: (args.height ? args.height : args.size) - lineWidth
      }
      this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
      this.settingsReset()
   },
   circle : function(x, y, rad, fill){
      if(typeof fill == 'undefined') fill = true
      cs.draw.ctx.beginPath();
      cs.draw.ctx.arc(x, y, rad, 0, Math.PI*2, true);
      cs.draw.ctx.closePath();
      (fill)
          ? cs.draw.ctx.fill()
          : cs.draw.ctx.stroke()
      this.settingsReset()
   },
   circleGradient : function(x, y, radius, c1, c2){
      //Draw a circle
      var g = this.ctx.createRadialGradient(x, y, 0, x, y, radius)
      g.addColorStop(1, c2)
      g.addColorStop(0, c1)
      this.ctx.fillStyle = g
      this.ctx.beginPath()
      this.ctx.arc(x, y, radius, 0, Math.PI*2, true)
      this.ctx.closePath()
      //Fill
      this.ctx.fill()
      this.settingsReset()
   },
   fixPosition: function(args){
      x = Math.floor(args.x); y = Math.floor(args.y);
      width = Math.floor(args.width);
      height = Math.floor(args.height);

      return { x:x, y:y, width:width, height:height }
   },
   setColor: function(color){
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = color;
   },
   setAlpha : function(alpha){
      this.ctx.globalAlpha = alpha;
   },
   setWidth : function(width){
      this.ctx.lineWidth = width;
   },
   setFont : function(font){
      this.ctx.font = font;
   },
   setLineHeight: function(height){
      this.ctx.lineHeight = height
   },
   setTextAlign : function(alignment){
      this.ctx.textAlign = alignment;
   },
   setTextBaseline : function(alignment){
      this.ctx.textBaseline=alignment;
   },
   setTextCenter : function(){
      this.setTextAlign('center');
      this.setTextBaseline('middle');
   },
   setOperation : function(operation){
      this.ctx.globalCompositeOperation = operation;
   },
   setSurface : function(name){
      this.surface = cs.surface.list[name]
      this.canvas = this.surface.canvas
      this.ctx = this.surface.ctx
      this.raw = this.surface.raw
      this.skip = this.surface.skip

      this.settingsReset()
   },
   settings: function(settings){
      for(var setting in settings){
         cs.draw.setting[setting] = settings[setting]
      }
      this.settingsUpdate()
   },
   settingsUpdate: function(){
      cs.draw.setAlpha(this.setting.alpha)
      cs.draw.setWidth(this.setting.width)
      cs.draw.setFont(this.setting.font)
      cs.draw.setTextAlign(this.setting.textAlign)
      cs.draw.setLineHeight(this.setting.lineHeight)
      cs.draw.setTextBaseline(this.setting.textBaseline)
      cs.draw.setColor(this.setting.color)
      cs.draw.setOperation(this.setting.operation)
   },
   settingsReset: function(){
      this.setting = {
         alpha: 1,
         width: 1,
         font: '12px Arial',
         textAlign: 'start',
         textBaseline: 'top',
         color: '#000',
         lineHeight: 10,
         operation: 'source-over'
      }
      this.settingsUpdate()
   }
}
