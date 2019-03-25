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
         font: { size: 12, family: 'Arial' },
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
      this.scale = this.surface.raw ? 1 : cs.camera.scale
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
      var info = cs.sprite.info(options)

      var x = options.x
      var y = options.y
      var frame = info.frame
      var frameWidth = info.width
      var frameHeight = info.height
      var xoff = info.xoff
      var yoff = info.yoff
      var scale = this.scale

      // if outside camera skip
      if (!this.surface.raw && !this.surface.drawOutside) {
         var cx = cs.camera.x
         var cy = cs.camera.y
         var cw = cs.camera.width
         var ch = cs.camera.height

         if (
            x - xoff - frameWidth > cx + cw || x - xoff + frameWidth < cx
            || y - yoff > cy + ch || y - yoff + frameHeight < cy
         ) {
            this.debug.spritesSkippedCount += 1
            return
         }
      }

      // Sean.. We will talk about this later. Not sure you know what you are doing.
      // I want to overlap on a single pixel when flipping
      if (info.scaleX < 0 && xoff) x++
      if (info.scaleY < 0 && yoff) y++

      if (info.scaleX < 0 || info.scaleY < 0 || info.angle) {
         this.surface.ctx.save()
         this.surface.ctx.translate(x * scale, y * scale)
         this.surface.ctx.rotate(options.angle * Math.PI / 180)
         this.surface.ctx.scale(info.scaleX, info.scaleY)

         this.surface.ctx.drawImage(
            frame,
            Math.floor(-xoff * scale),
            Math.floor(-yoff * scale),
            Math.floor(frameWidth * scale),
            Math.floor(frameHeight * scale)
         )

         this.surface.ctx.restore()
      } else {
         this.surface.ctx.drawImage(
            frame,
            Math.floor(x * scale - xoff * scale),
            Math.floor(y * scale - yoff * scale),
            Math.floor(frameWidth * scale),
            Math.floor(frameHeight * scale)
         )
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
      var x = options.x * this.scale
      var y = options.y * this.scale
      if (options.lines) {
         for (var line in options.lines) {
            this.surface.ctx.fillText(options.lines[line], x, y + (line * (options.lineHeight || this.surface.ctx.lineHeight)))
         }
      } else {
         this.surface.ctx.fillText(options.text, x, y)
      }
      this.settingsDefault()
   },

   textWidth: function(str) {
      return this.surface.ctx.measureText(str).width
   },

   line: function(options) {
      var lineWidth = this.surface.ctx.lineWidth / this.scale
      var lineWidthAdjust = lineWidth / 2
      var x1 = options.x1 + lineWidthAdjust
      var x2 = options.x2 + lineWidthAdjust
      var y1 = options.y1 - lineWidthAdjust
      var y2 = options.y2 - lineWidthAdjust

      this.surface.ctx.beginPath();
      this.surface.ctx.moveTo(x1 * this.scale, y1 * this.scale);
      this.surface.ctx.lineTo(x2 * this.scale, y2 * this.scale);
      this.surface.ctx.stroke()
      this.settingsDefault()
   },

   fillRect: function(args) {
      if (typeof args.width == 'undefined') args.width = args.size || 1
      if (typeof args.height == 'undefined') args.height = args.size || 1

      this.surface.ctx.fillRect(
         args.x * this.scale,
         args.y * this.scale,
         args.width * this.scale,
         args.height * this.scale,
      )
      this.settingsDefault()
   },

   strokeRect: function(args) {
      var lineWidth = this.surface.ctx.lineWidth / this.scale
      var lineWidthAdjust = lineWidth / 2
      var rect = {
         x: args.x + lineWidthAdjust,
         y: args.y + lineWidthAdjust,
         width: (args.width ? args.width : args.size) - lineWidth,
         height: (args.height ? args.height : args.size) - lineWidth,
      }

      this.surface.ctx.strokeRect(
         rect.x * this.scale,
         rect.y * this.scale,
         rect.width * this.scale,
         rect.height * this.scale
      )
      this.settingsDefault()
   },

   circle: function(x, y, rad, fill) {
      if (typeof fill == 'undefined') fill = true
      this.surface.ctx.beginPath()
      this.surface.ctx.arc(x * this.scale, y * this.scale, rad * this.scale, 0, Math.PI * 2, true)
      this.surface.ctx.closePath()
      fill ? this.surface.ctx.fill() : cs.draw.ctx.stroke()
      this.settingsDefault()
   },

   circleGradient: function(x, y, radius, c1, c2) {
      var g = this.surface.ctx.createRadialGradient(
         x * this.scale,
         y * this.scale,
         0,
         x * this.scale,
         y * this.scale,
         radius * this.scale
      )
      g.addColorStop(1, c2)
      g.addColorStop(0, c1)
      this.surface.ctx.fillStyle = g
      this.surface.ctx.beginPath()
      this.surface.ctx.arc(x * this.scale, y * this.scale, radius * this.scale, 0, Math.PI * 2, true)
      this.surface.ctx.closePath()
      // fill
      this.surface.ctx.fill()
      this.settingsDefault()
   },

   shape: function(options) {
      var vertices = options.vertices
      this.surface.ctx.beginPath()
      this.surface.ctx.moveTo(vertices[0].x * this.scale, vertices[0].y * this.scale)

      for (var i = 1; i < vertices.length; i++) {
         this.surface.ctx.lineTo(vertices[i].x * this.scale, vertices[i].y * this.scale)
      }

      this.surface.ctx.closePath(vertices[0].x * this.scale, vertices[0].y * this.scale)
      !options.fill && this.surface.ctx.stroke()
      options.fill && this.surface.ctx.fill()
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
      if(this.surface.ctx.lineWidth === width * this.scale) return
      this.surface.ctx.lineWidth = width * this.scale;
   },

   setFont: function(options) {
      if(this.surface.ctx.fontSize === options.size * this.scale && this.surface.ctx.fontFamily === options.family) return
      this.surface.ctx.fontSize = options.size * this.scale
      this.surface.ctx.fontFamily = options.family
      this.surface.ctx.font = (options.effect ? options.effect + ' ' : '') + options.size * this.scale + 'px ' + options.family;
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
