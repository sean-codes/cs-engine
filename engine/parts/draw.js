//---------------------------------------------------------------------------------------------//
//----------------------------------| Drawing Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.draw = {
   debug: {},
   surface: {},

   config: {
      defaults: {
         alpha: 1,
         width: 1,
         font: '12px Arial',
         textAlign: 'start',
         textBaseline: 'top',
         color: '#000',
         lineHeight: 10,
         operation: 'source-over'
      },
      current: {} // will clone on settingsDefault()
   },

   setSurface: function(name) {
      this.surface = cs.surface.list[name]
      this.settingsDefault()
   },

   debugReset: function() {
      this.debug = {
         spritesSkipped: this.debug.spritesSkippedCount,
         spritesDrawn: this.debug.spritesDrawnCount,
         spritesSkippedCount: 0,
         spritesDrawnCount: 0
      }
   },

   sprite: function(options) {
      sprite = cs.sprite.list[options.spr]
      var info = cs.sprite.info(options)

      // if outside camera skip
      if (!this.surface.raw && !this.surface.drawOutside && !options.drawOutside) {
         var x = options.x - (options.scaleX < 0 ? sprite.fwidth : 0)
         var y = options.y - (options.scaleY < 0 ? sprite.fheight : 0)

         if (x + sprite.fwidth < cs.camera.x ||
            x > cs.camera.x + cs.camera.width ||
            x > cs.camera.x + cs.camera.width ||
            y + sprite.fheight - sprite.yoff < cs.camera.y ||
            y - sprite.yoff > cs.camera.y + cs.camera.height) {

            this.debug.spritesSkippedCount += 1
            return
         }
      }

      var xoff = options.center || options.centerX ? sprite.fwidth / 2 : cs.default(options.xoff, sprite.xoff)
      var yoff = options.center || options.centerY ? sprite.fheight / 2 : cs.default(options.yoff, sprite.yoff)

      // Sean.. We will talk about this later. Not sure you know what you are doing.
      // I want to overlap on a single pixel when flipping
      if (info.scaleX < 0 && xoff) options.x++
      if (info.scaleY < 0 && yoff) options.y++

            if (options.angle || options.scaleX != 1 || options.scaleY != 1) {
               this.surface.ctx.save()
               this.surface.ctx.translate(Math.ceil(options.x), Math.ceil(options.y))
               this.surface.ctx.scale(info.scaleX, info.scaleY)
               this.surface.ctx.rotate(options.angle * Math.PI / 180 * Math.sign(info.scaleX))
               this.surface.ctx.drawImage(info.frames[info.frame || 0], -xoff, -yoff)
               this.surface.ctx.restore()
            } else {
               this.surface.ctx.drawImage(info.frames[info.frame || 0], Math.ceil(options.x - xoff), Math.ceil(options.y - yoff))
            }

      this.debug.spritesDrawnCount += 1
      cs.draw.settingsDefault()
   },

   textInfo: function(options) {
      // Guessing the size
      var lines = []
      var curLine = []
      var y = 0,
         x = 0
      var textArr = (options.text.toString()).split('')

      // Setup the lines
      for (var pos in textArr) {
         curLine.push(textArr[pos])

         if (this.surface.ctx.measureText(curLine.join('')).width > options.width) {
            // Try to find a space
            for (var o = curLine.length; o > 0; o--)
               if (curLine[o] == ' ') break

            // If no space add a dash
            if (!o) {
               o = curLine.length - 2
               curLine.splice(o - 1, 0, '-')
            }

            // Draw and reset
            lines.push(curLine.slice(0, o).join('').trim())
            curLine = curLine.slice(o, curLine.length)
            y += options.lineHeight
         }
         if (pos == textArr.length - 1) {
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

   text: function(options) {
      if (options.lines) {
         for (var line in options.lines) {
            this.surface.ctx.fillText(options.lines[line], options.x, options.y + (line * (options.lineHeight || this.surface.ctx.lineHeight)))
         }
      } else {
         this.surface.ctx.fillText(options.text, options.x, options.y)
      }
      this.settingsDefault()
   },

   textWidth: function(str) {
      return this.surface.ctx.measureText(str).width
   },

   line: function(options) {
      var cx = 0 - ((this.surface.ctx.lineWidth % 2 == 0) ? 0 : 0.50)
      var cy = 0 - ((this.surface.ctx.lineWidth % 2 == 0) ? 0 : 0.50)

      this.surface.ctx.beginPath();
      this.surface.ctx.moveTo(options.x1 - cx, options.y1 - cy);
      this.surface.ctx.lineTo(options.x2 - cx, options.y2 - cy);
      this.surface.ctx.stroke()
      this.settingsDefault()
   },

   fillRect: function(args) {
      if (typeof args.width == 'undefined') args.width = args.size || 1
      if (typeof args.height == 'undefined') args.height = args.size || 1

      this.surface.ctx.fillRect(Math.floor(args.x), Math.floor(args.y), args.width, args.height)
      this.settingsDefault()
   },

   strokeRect: function(args) {
      var lineWidth = this.surface.ctx.lineWidth
      var lineWidthAdjust = lineWidth / 2
      var rect = {
         x: args.x + lineWidthAdjust,
         y: args.y + lineWidthAdjust,
         width: (args.width ? args.width : args.size) - lineWidth,
         height: (args.height ? args.height : args.size) - lineWidth
      }
      this.surface.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
      this.settingsDefault()
   },

   circle: function(x, y, rad, fill) {
      if (typeof fill == 'undefined') fill = true
      this.surface.ctx.beginPath();
      this.surface.ctx.arc(x, y, rad, 0, Math.PI * 2, true);
      this.surface.ctx.closePath();
      (fill) ?
      this.surface.ctx.fill(): cs.draw.ctx.stroke()
      this.settingsDefault()
   },

   circleGradient: function(x, y, radius, c1, c2) {
      //Draw a circle
      var g = this.surface.ctx.createRadialGradient(x, y, 0, x, y, radius)
      g.addColorStop(1, c2)
      g.addColorStop(0, c1)
      this.surface.ctx.fillStyle = g
      this.surface.ctx.beginPath()
      this.surface.ctx.arc(x, y, radius, 0, Math.PI * 2, true)
      this.surface.ctx.closePath()
      //Fill
      this.surface.ctx.fill()
      this.settingsDefault()
   },

   fixPosition: function(args) {
      x = Math.floor(args.x);
      y = Math.floor(args.y);
      width = Math.floor(args.width);
      height = Math.floor(args.height);

      return { x: x, y: y, width: width, height: height }
   },

   setColor: function(color) {
      if(this.surface.ctx.fillStyle === color && this.surface.ctx.strokeStyle === color) return
      this.surface.ctx.fillStyle = color;
      this.surface.ctx.strokeStyle = color;
   },

   setAlpha: function(alpha) {
      if(this.surface.ctx.globalAlpha === alpha) return
      this.surface.ctx.globalAlpha = alpha;
   },

   setWidth: function(width) {
      if(this.surface.ctx.lineWidth === width) return
      this.surface.ctx.lineWidth = width;
   },

   setFont: function(font) {
      if(this.surface.ctx.font === font) return
      this.surface.ctx.font = font;
   },

   setLineHeight: function(height) {
      if(this.surface.ctx.lineHeight === height) return
      this.surface.ctx.lineHeight = height
   },

   setTextAlign: function(alignment) {
      if(this.surface.ctx.textAlign === alignment) return
      this.surface.ctx.textAlign = alignment;
   },

   setTextBaseline: function(alignment) {
      if(this.surface.ctx.textBaseline === alignment) return
      this.surface.ctx.textBaseline = alignment;
   },

   setTextCenter: function() {
      this.setTextAlign('center');
      this.setTextBaseline('middle');
   },

   setOperation: function(operation) {
      if(this.surface.ctx.globalCompositeOperation === operation) return
      this.surface.ctx.globalCompositeOperation = operation;
   },

   settings: function(settings) {
      for (var setting in settings) {
         this.config.current[setting] = settings[setting]
      }
      this.settingsUpdate()
   },

   default: function(settings) {
      for (var setting in settings) {
         this.config.defaults[setting] = settings[setting]
      }
      this.settingsDefault()
   },

   settingsUpdate: function() {
      cs.draw.setAlpha(this.config.current.alpha)
      cs.draw.setWidth(this.config.current.width)
      cs.draw.setFont(this.config.current.font)
      cs.draw.setTextAlign(this.config.current.textAlign)
      cs.draw.setLineHeight(this.config.current.lineHeight)
      cs.draw.setTextBaseline(this.config.current.textBaseline)
      cs.draw.setColor(this.config.current.color)
      cs.draw.setOperation(this.config.current.operation)
   },

   settingsDefault: function() {
      for (var setting in this.config.defaults) {
         this.config.current[setting] = this.config.defaults[setting]
      }

      this.settingsUpdate()
   }
}
