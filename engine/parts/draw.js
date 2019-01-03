//---------------------------------------------------------------------------------------------//
//----------------------------------| Drawing Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.draw = {
   ctx: undefined,
   canvas: { width: 0, height: 0 },
   alpha: 1,
   raw: false,
   height: 0,
   width: 0,
   fontSize: 10,
   lineHeight: 10,
   debug: {},
   w: 0,
   h: 0,
   o: 0,
   settings: {
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
      this.canvas = this.surface.canvas
      this.ctx = this.surface.ctx
      this.raw = this.surface.raw
      this.skip = this.surface.skip

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
      if (!this.raw && !this.surface.drawOutside && !options.drawOutside) {
         var x = options.x - (options.scaleX < 0 ? sprite.fwidth : 0)
         var y = options.y - (options.scaleY < 0 ? sprite.fheight : 0)

         if (x + sprite.fwidth < cs.camera.x ||
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
               this.ctx.save()
               this.ctx.translate(Math.ceil(options.x), Math.ceil(options.y))
               this.ctx.scale(info.scaleX, info.scaleY)
               this.ctx.rotate(options.angle * Math.PI / 180 * Math.sign(info.scaleX))
               this.ctx.drawImage(info.frames[info.frame || 0], -xoff, -yoff)
               this.ctx.restore()
            } else {
               this.ctx.drawImage(info.frames[info.frame || 0], Math.ceil(options.x - xoff), Math.ceil(options.y - yoff))
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

         if (this.ctx.measureText(curLine.join('')).width > options.width) {
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
            this.ctx.fillText(options.lines[line], options.x, options.y + (line * (options.lineHeight || this.ctx.lineHeight)))
         }
      } else {
         this.ctx.fillText(options.text, options.x, options.y)
      }
      this.settingsDefault()
   },
   textWidth: function(str) {
      return this.ctx.measureText(str).width
   },
   line: function(options) {
      var cx = 0 - ((this.ctx.lineWidth % 2 == 0) ? 0 : 0.50)
      var cy = 0 - ((this.ctx.lineWidth % 2 == 0) ? 0 : 0.50)

      this.ctx.beginPath();
      this.ctx.moveTo(options.x1 - cx, options.y1 - cy);
      this.ctx.lineTo(options.x2 - cx, options.y2 - cy);
      this.ctx.stroke()
      this.settingsDefault()
   },
   fillRect: function(args) {
      if (typeof args.width == 'undefined') args.width = args.size || 1
      if (typeof args.height == 'undefined') args.height = args.size || 1

      this.ctx.fillRect(Math.floor(args.x), Math.floor(args.y), args.width, args.height)
      this.settingsDefault()
   },
   strokeRect: function(args) {
      var lineWidth = this.ctx.lineWidth
      var lineWidthAdjust = lineWidth / 2
      var rect = {
         x: args.x + lineWidthAdjust,
         y: args.y + lineWidthAdjust,
         width: (args.width ? args.width : args.size) - lineWidth,
         height: (args.height ? args.height : args.size) - lineWidth
      }
      this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
      this.settingsDefault()
   },
   circle: function(x, y, rad, fill) {
      if (typeof fill == 'undefined') fill = true
      cs.draw.ctx.beginPath();
      cs.draw.ctx.arc(x, y, rad, 0, Math.PI * 2, true);
      cs.draw.ctx.closePath();
      (fill) ?
      cs.draw.ctx.fill(): cs.draw.ctx.stroke()
      this.settingsDefault()
   },
   circleGradient: function(x, y, radius, c1, c2) {
      //Draw a circle
      var g = this.ctx.createRadialGradient(x, y, 0, x, y, radius)
      g.addColorStop(1, c2)
      g.addColorStop(0, c1)
      this.ctx.fillStyle = g
      this.ctx.beginPath()
      this.ctx.arc(x, y, radius, 0, Math.PI * 2, true)
      this.ctx.closePath()
      //Fill
      this.ctx.fill()
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
      if(this.ctx.fillStyle === color && this.ctx.strokeStyle === color) return
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = color;
   },
   setAlpha: function(alpha) {
      if(this.ctx.globalAlpha === alpha) return
      this.ctx.globalAlpha = alpha;
   },
   setWidth: function(width) {
      if(this.ctx.lineWidth === width) return
      this.ctx.lineWidth = width;
   },
   setFont: function(font) {
      if(this.ctx.font === font) return
      this.ctx.font = font;
   },
   setLineHeight: function(height) {
      if(this.ctx.lineHeight === height) return
      this.ctx.lineHeight = height
   },
   setTextAlign: function(alignment) {
      if(this.ctx.textAlign === alignment) return
      this.ctx.textAlign = alignment;
   },
   setTextBaseline: function(alignment) {
      if(this.ctx.textBaseline === alignment) return
      this.ctx.textBaseline = alignment;
   },
   setTextCenter: function() {
      this.setTextAlign('center');
      this.setTextBaseline('middle');
   },
   setOperation: function(operation) {
      if(this.ctx.globalCompositeOperation === operation) return
      this.ctx.globalCompositeOperation = operation;
   },
   set: function(settings) {
      for (var setting in settings) {
         this.settings.current[setting] = settings[setting]
      }
      this.settingsUpdate()
   },
   default: function(settings) {
      for (var setting in settings) {
         this.settings.defaults[setting] = settings[setting]
      }
      this.settingsDefault()
   },
   settingsUpdate: function() {
      cs.draw.setAlpha(this.settings.current.alpha)
      cs.draw.setWidth(this.settings.current.width)
      cs.draw.setFont(this.settings.current.font)
      cs.draw.setTextAlign(this.settings.current.textAlign)
      cs.draw.setLineHeight(this.settings.current.lineHeight)
      cs.draw.setTextBaseline(this.settings.current.textBaseline)
      cs.draw.setColor(this.settings.current.color)
      cs.draw.setOperation(this.settings.current.operation)
   },
   settingsDefault: function() {
      for (var setting in this.settings.defaults) {
         this.settings.current[setting] = this.settings.defaults[setting]
      }

      this.settingsUpdate()
   }
}
