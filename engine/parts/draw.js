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
      this.scale = 1
      this.cameraX = 0
      this.cameraY = 0
      this.zScaleHack = 0

      if (this.surface.useCamera && this.surface.oneToOne) {
         var camera = cs.camera.info()

         this.scale = camera.zScale
         this.cameraX = camera.x
         this.cameraY = camera.y

         // helps sync up scaled surfaces with unscaled
         if (this.surface.oneToOne && camera.scale > 1) {
            this.zScaleHack = 1
         }
      }

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
      var scale = this.scale
      var info = cs.sprite.info(options)
      var frame = info.frame
      var xOff = info.xoff
      var yOff = info.yoff

      // dest
      var dx = options.x - this.cameraX
      var dy = options.y - this.cameraY
      var dWidth = info.width
      var dHeight = info.height

      // source
      var sx = 0
      var sy = 0
      var sWidth = info.fWidth
      var sHeight = info.fHeight

      // trimming
      if (options.hTrim) {
         sHeight -= options.hTrim
         dHeight -= options.hTrim
      }

      // when flipping match the pixel
      if (info.scaleX < 0 && xOff) dx++
      if (info.scaleY < 0 && yOff) dy++



      var rotateOrSomething = (info.scaleX < 0 || info.scaleY < 0 || info.angle)
      if (rotateOrSomething) {
         this.surface.ctx.save()
         this.surface.ctx.translate((dx * scale), (dy * scale))
         this.surface.ctx.rotate(options.angle * Math.PI / 180)
         this.surface.ctx.scale(info.scaleX, info.scaleY)

         this.surface.ctx.drawImage(
            frame,
            sx, sy, sWidth, sHeight,
            (-xOff * scale),
            (-yOff * scale + this.zScaleHack),
            (dWidth * scale),
            (dHeight * scale)
         )

         this.surface.ctx.restore()
      } else {
         this.surface.ctx.drawImage(
            frame,
            sx, sy, sWidth, sHeight,
            ((dx - xOff) * scale),
            ((dy - yOff) * scale) + this.zScaleHack,
            (dWidth * scale),
            (dHeight * scale)
         )
      }

      this.debug.spritesDrawnCount += 1
      cs.draw.settingsDefault()
      return
   },

   textInfo: function(options) {
      // Guessing the size
      var lines = []
      var curLine = []
      var y = 0
      var x = 0
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
      var x = options.x - this.cameraX
      var y = options.y - this.cameraY
      var scale = this.scale

      if (options.lines) {
         for (var line in options.lines) {
            var lineYOffset = (line * (options.lineHeight || this.surface.ctx.lineHeight))
            this.surface.ctx.fillText(
               options.lines[line],
               x * scale,
               (y + lineYOffset) * scale
            )
         }
      } else {
         this.surface.ctx.fillText(
            options.text,
            Math.floor(x * scale),
            Math.floor(y * scale)
         )
      }
      this.settingsDefault()
   },

   textWidth: function(str) {
      return this.surface.ctx.measureText(str).width
   },

   line: function(options) {
      var lineWidth = this.surface.ctx.lineWidth
      var lineWidthAdjust = lineWidth / 2 / this.scale
      var scale = this.scale

      var x1 = options.x1 + lineWidthAdjust - this.cameraX
      var x2 = options.x2 + lineWidthAdjust - this.cameraX
      var y1 = options.y1 - lineWidthAdjust - this.cameraY
      var y2 = options.y2 - lineWidthAdjust - this.cameraY

      this.surface.ctx.beginPath();
      this.surface.ctx.moveTo(x1 * scale, y1 * scale);
      this.surface.ctx.lineTo(x2 * scale, y2 * scale);
      this.surface.ctx.stroke()
      this.settingsDefault()
   },

   fillRect: function(args) {
      var scale = this.scale
      var x = args.x - this.cameraX
      var y = args.y - this.cameraY
      var width = cs.default(args.width, args.size)
      var height = cs.default(args.height, args.size)

      this.surface.ctx.fillRect(
         x * scale,
         y * scale,
         width * scale,
         height * scale,
      )
      this.settingsDefault()
   },

   strokeRect: function(args) {
      var scale = this.scale
      var lineWidth = this.surface.ctx.lineWidth
      var lineWidthAdjust = lineWidth / 2 / scale

      var x = args.x + lineWidthAdjust - this.cameraX
      var y = args.y + lineWidthAdjust - this.cameraY
      var width = cs.default(args.width, args.size) - lineWidthAdjust * 2
      var height = cs.default(args.height, args.size) - lineWidthAdjust * 2

      this.surface.ctx.strokeRect(
         x * scale,
         y * scale,
         width * scale,
         height * scale,
      )

      this.settingsDefault()
   },

   circle: function(options) {
      var scale = this.scale
      var x = options.x - this.cameraX
      var y = options.y - this.cameraY
      var radius = options.radius
      var fill = cs.default(options.fill, false)

      this.surface.ctx.beginPath()
      this.surface.ctx.arc(
         x * scale,
         y * scale,
         radius * scale,
         0, Math.PI * 2, true
      )
      this.surface.ctx.closePath()
      fill ? this.surface.ctx.fill() : this.surface.ctx.stroke()
      this.settingsDefault()
   },

   circleGradient: function(options) {
      var scale = this.scale
      var x = options.x - this.cameraX
      var y = options.y - this.cameraY
      var radius = options.radius
      var colorStart = options.colorStart
      var colorEnd = options.colorEnd

      var g = this.surface.ctx.createRadialGradient(
         x * scale,
         y * scale,
         0,
         x * scale,
         y * scale,
         radius * scale
      )
      g.addColorStop(1, colorEnd)
      g.addColorStop(0, colorStart)
      this.surface.ctx.fillStyle = g
      this.surface.ctx.beginPath()
      this.surface.ctx.arc(
         x * scale,
         y * scale,
         radius * scale,
         0, Math.PI * 2, true
      )
      this.surface.ctx.closePath()
      this.surface.ctx.fill()
      this.settingsDefault()
   },

   shape: function(options) {
      var scale = this.scale
      var vertices = options.vertices

      this.surface.ctx.beginPath()
      this.surface.ctx.moveTo(
         (vertices[0].x - this.cameraX) * scale,
         (vertices[0].y - this.cameraY) * scale
      )

      for (var i = 1; i < vertices.length; i++) {
         this.surface.ctx.lineTo(
            (vertices[i].x - this.cameraX) * scale,
            (vertices[i].y - this.cameraY) * scale
         )
      }

      this.surface.ctx.closePath(
         (vertices[0].x - this.cameraX) * scale,
         (vertices[0].y - this.cameraY) * scale
      )

      !options.fill && this.surface.ctx.stroke()
      options.fill && this.surface.ctx.fill()
      this.settingsDefault()
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
