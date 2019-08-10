//----------------------------------------------------------------------------//
//------------------------------| CS ENGINE: DRAW |---------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_DRAW {
      constructor(cs) {
         this.cs = cs
         this.debug = {}
         this.surface = {}
         this.config = {
            defaults: {
               alpha: 1,
               width: 1,
               font: { size: 12, family: 'Arial' },
               textAlign: 'start',
               textBaseline: 'top',
               color: '#000',
               lineHeight: 10,
               lineDash: [],
               operation: 'source-over'
            },
            current: {} // will clone on settingsDefault()
         }
      }

      setSurface(surfaceName) {
         this.surface = this.cs.surface.list[surfaceName]
         this.scale = 1
         this.cameraX = 0
         this.cameraY = 0
         this.cameraWidth = this.surface.width
         this.cameraHeight = this.surface.height
         this.zScaleHack = 0

         if (this.surface.useCamera && this.surface.oneToOne) {
            var camera = this.cs.camera.info()

            this.scale = camera.zScale
            this.cameraX = camera.x
            this.cameraY = camera.y
            this.cameraWidth = camera.width
            this.cameraHeight = camera.height

            // helps sync up scaled surfaces with unscaled
            if (this.surface.oneToOne && camera.scale > 1) {
               this.zScaleHack = 1
            }
         }

         this.settingsDefault()
      }

      debugReset() {
         this.debug = {
            spritesSkipped: this.debug.spritesSkippedCount,
            spritesDrawn: this.debug.spritesDrawnCount,
            rectanglesSkipped: this.debug.rectanglesSkippedCount,
            rectanglesDrawn: this.debug.rectanglesDrawnCount,
            shapesSkipped: this.debug.shapesSkippedCount,
            shapesDrawn: this.debug.shapesDrawnCount,
            circlesSkipped: this.debug.circlesSkippedCount,
            circlesDrawn: this.debug.circlesDrawnCount,
            spritesSkippedCount: 0,
            spritesDrawnCount: 0,
            rectanglesSkippedCount: 0,
            rectanglesDrawnCount: 0,
            shapesSkippedCount: 0,
            shapesDrawnCount: 0,
            circlesSkippedCount: 0,
            circlesDrawnCount: 0,
         }
      }

      outside(o) {
         return (
            o.x + o.width < this.cameraX ||
            o.x > this.cameraX + this.cameraWidth ||
            o.y + o.height < this.cameraY ||
            o.y > this.cameraY + this.cameraHeight
         )
      }

      sprite(options) {
         var scale = this.scale
         var info = this.cs.sprite.info(options)
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
         this.settingsDefault()
         return
      }

      textInfo(options) {
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
      }

      text(options) {
         var x = options.x - this.cameraX
         var y = options.y - this.cameraY
         var scale = this.scale

         options.center && this.cs.draw.setTextCenter()

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
      }

      textWidth(str) {
         return this.surface.ctx.measureText(str).width
      }

      line(options) {
         var scale = this.scale
         var lineWidth = this.surface.ctx.lineWidth
         var lineWidthAdjust = lineWidth / 2 / scale

         var x1 = options.points[0].x * scale + lineWidthAdjust - this.cameraX * scale
         var x2 = options.points[1].x * scale + lineWidthAdjust - this.cameraX * scale
         var y1 = options.points[0].y * scale - lineWidthAdjust - this.cameraY * scale
         var y2 = options.points[1].y * scale - lineWidthAdjust - this.cameraY * scale

         this.surface.ctx.beginPath();
         this.surface.ctx.moveTo(x1, y1);
         this.surface.ctx.lineTo(x2, y2);
         this.surface.ctx.stroke()
         this.settingsDefault()
      }

      fillRect(args) {
         // console.log('drawing', args)
         var scale = this.scale
         var x = args.x
         var y = args.y
         var width = this.cs.default(args.width, args.size)
         var height = this.cs.default(args.height, args.size)

         if (args.center) {
            x -= width / 2
            y -= height / 2
         }

         if (this.outside({ x: x, y: y, width: width, height: height })) {
            this.debug.rectanglesSkippedCount += 1
            this.settingsDefault()
            return
         } else {
            this.debug.rectanglesDrawnCount += 1
         }

         this.surface.ctx.fillRect(
            (x - this.cameraX) * scale,
            (y - this.cameraY) * scale,
            width * scale,
            height * scale,
         )
         this.settingsDefault()
      }

      strokeRect(args) {
         var scale = this.scale
         var lineWidth = this.surface.ctx.lineWidth
         var lineWidthAdjust = lineWidth / 2 / scale

         var x = args.x + lineWidthAdjust
         var y = args.y + lineWidthAdjust
         var width = this.cs.default(args.width, args.size) - lineWidthAdjust * 2
         var height = this.cs.default(args.height, args.size) - lineWidthAdjust * 2

         if (args.center) {
            x -= width / 2
            y -= height / 2
         }

         if (this.outside({ x: x, y: y, width: width, height: height })) {
            this.debug.rectanglesSkippedCount += 1
            this.settingsDefault()
            return
         } else {
            this.debug.rectanglesDrawnCount += 1
         }

         this.surface.ctx.strokeRect(
            (x - this.cameraX) * scale,
            (y - this.cameraY) * scale,
            width * scale,
            height * scale,
         )

         this.settingsDefault()
      }

      circle(options) {
         var scale = this.scale
         var x = options.pos ? options.pos.x : options.x
         var y = options.pos ? options.pos.y : options.y
         var start = (cs.default(options.start, 0) - 90) * Math.PI/180
         var end = (cs.default(options.end, 360) - 90) * Math.PI/180
         var radius = options.radius

         if (this.outside({
            x: x - radius,
            y: y - radius,
            width: radius * 2,
            height: radius * 2,
         })) {
            this.debug.circlesSkippedCount += 1
            this.settingsDefault()
            return
         } else {
            this.debug.circleDrawnCount += 1
         }


         this.surface.ctx.beginPath()
         this.surface.ctx.arc(
            (x - this.cameraX) * scale,
            (y - this.cameraY) * scale,
            radius * scale,
            start,
            end
         )

         var fill = this.cs.default(options.fill, false)
         fill ? this.surface.ctx.fill() : this.surface.ctx.stroke()

         this.settingsDefault()
      }

      circleGradient(options) {
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
      }

      shape(options) {
         var scale = this.scale
         var vertices = options.vertices
         var relative = this.cs.default(options.relative, { x: 0, y: 0 })

         var bounds = { xmin: 0, ymin: 0, xmax: 0, ymax: 0 }
         for (var i = 0; i < vertices.length; i++) {
            bounds.xmin = Math.min(relative.x + vertices[i].x, bounds.xmin)
            bounds.ymin = Math.min(relative.y + vertices[i].y, bounds.ymin)
            bounds.xmax = Math.max(relative.x + vertices[i].x, bounds.xmax)
            bounds.ymax = Math.max(relative.y + vertices[i].y, bounds.ymax)
         }

         if (this.outside({
            x: bounds.xmin,
            y: bounds.ymin,
            width: bounds.xmax - bounds.xmin,
            height: bounds.ymax - bounds.ymin
         })) {
            this.debug.shapesSkippedCount += 1
            this.settingsDefault()
            return
         } else {
            this.debug.shapesDrawnCount += 1
         }


         this.surface.ctx.beginPath()
         this.surface.ctx.moveTo(
            (relative.x + vertices[0].x - this.cameraX) * scale,
            (relative.y + vertices[0].y - this.cameraY) * scale
         )

         for (var i = 1; i < vertices.length; i++) {
            this.surface.ctx.lineTo(
               (relative.x + vertices[i].x - this.cameraX) * scale,
               (relative.y + vertices[i].y - this.cameraY) * scale
            )
         }

         this.surface.ctx.closePath(
            (relative.x + vertices[0].x - this.cameraX) * scale,
            (relative.y + vertices[0].y - this.cameraY) * scale
         )

         !options.fill && this.surface.ctx.stroke()
         options.fill && this.surface.ctx.fill()
         this.settingsDefault()
      }

      setColor(color) {
         if (this.surface.ctx.fillStyle === color && this.surface.ctx.strokeStyle === color) return
         this.surface.ctx.fillStyle = color
         this.surface.ctx.strokeStyle = color
      }

      setAlpha(alpha) {
         if(this.surface.ctx.globalAlpha === alpha) return
         this.surface.ctx.globalAlpha = alpha
      }

      setWidth(width) {
         if(this.surface.ctx.lineWidth === width * this.scale) return
         this.surface.ctx.lineWidth = width * this.scale
      }

      setFont(options) {
         if(this.surface.ctx.fontSize === options.size * this.scale && this.surface.ctx.fontFamily === options.family) return
         this.surface.ctx.fontSize = options.size * this.scale
         this.surface.ctx.fontFamily = options.family
         this.surface.ctx.font = (options.effect ? options.effect + ' ' : '') + options.size * this.scale + 'px ' + options.family
      }

      setLineHeight(height) {
         if(this.surface.ctx.lineHeight === height) return
         this.surface.ctx.lineHeight = height
      }

      setLineDash(lineDash) {
         this.surface.ctx.setLineDash(lineDash)
      }

      setTextAlign(alignment) {
         if(this.surface.ctx.textAlign === alignment) return
         this.surface.ctx.textAlign = alignment;
      }

      setTextBaseline(alignment) {
         if(this.surface.ctx.textBaseline === alignment) return
         this.surface.ctx.textBaseline = alignment;
      }

      setTextCenter() {
         this.setTextAlign('center');
         this.setTextBaseline('middle');
      }

      setOperation(operation) {
         if(this.surface.ctx.globalCompositeOperation === operation) return
         this.surface.ctx.globalCompositeOperation = operation;
      }

      settings(settings) {
         for (var setting in settings) {
            this.config.current[setting] = settings[setting]
         }
         this.settingsUpdate()
      }

      default(settings) {
         for (var setting in settings) {
            this.config.defaults[setting] = settings[setting]
         }
      }

      settingsUpdate() {
         this.setAlpha(this.config.current.alpha)
         this.setWidth(this.config.current.width)
         this.setFont(this.config.current.font)
         this.setTextAlign(this.config.current.textAlign)
         this.setLineHeight(this.config.current.lineHeight)
         this.setTextBaseline(this.config.current.textBaseline)
         this.setColor(this.config.current.color)
         this.setOperation(this.config.current.operation)
         this.setLineDash(this.config.current.lineDash)
      }

      settingsDefault() {
         for (var setting in this.config.defaults) {
            this.config.current[setting] = this.config.defaults[setting]
         }

         this.settingsUpdate()
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_DRAW
      : cs.draw = new CSENGINE_DRAW(cs)
})()
