// -------------------------------------------------------------------------- //
// -----------------------------| CS ENGINE: DRAW |-------------------------- //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_DRAW {
      constructor(cs) {
         this.cs = cs
         this.debug = {}
         this.surface = undefined
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
               operation: 'source-over',
            },
            current: {}, // will clone on settingsDefault()
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
            const camera = this.cs.camera.info()

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
            o.x + o.width < this.cameraX
            || o.x > this.cameraX + this.cameraWidth
            || o.y + o.height < this.cameraY
            || o.y > this.cameraY + this.cameraHeight
         )
      }

      sprite(options) {
         const { scale } = this
         const info = this.cs.sprite.info(options)
         const { frame } = info
         const xOff = info.xoff
         const yOff = info.yoff

         // dest
         let dx = options.x - this.cameraX
         let dy = options.y - this.cameraY
         let dWidth = info.width
         let dHeight = info.height

         // source
         const sx = 0
         const sy = 0
         let sWidth = info.fWidth
         let sHeight = info.fHeight

         // trimming
         if (options.hTrim) {
            sHeight -= options.hTrim
            dHeight -= options.hTrim
         }

         if (options.wTrim) {
            sWidth -= options.wTrim
            dWidth -= options.wTrim
         }

         // when flipping match the pixel
         if (info.scaleX < 0 && xOff) dx += 1
         if (info.scaleY < 0 && yOff) dy += 1

         const rotateOrSomething = (info.scaleX < 0 || info.scaleY < 0 || info.angle)
         if (rotateOrSomething) {
            this.surface.ctx.save()
            this.surface.ctx.translate((dx * scale), (dy * scale))
            this.surface.ctx.rotate((options.angle * Math.PI) / 180)
            this.surface.ctx.scale(info.scaleX, info.scaleY)

            this.surface.ctx.drawImage(
               frame,
               sx, sy, sWidth, sHeight,
               (-xOff * scale),
               (-yOff * scale + this.zScaleHack),
               (dWidth * scale),
               (dHeight * scale),
            )

            this.surface.ctx.restore()
         } else {
            this.surface.ctx.drawImage(
               frame,
               sx, sy, sWidth, sHeight,
               ((dx - xOff) * scale),
               ((dy - yOff) * scale) + this.zScaleHack,
               (dWidth * scale),
               (dHeight * scale),
            )
         }

         this.debug.spritesDrawnCount += 1
         this.settingsDefault()
      }

      textInfo(options) {
         // Guessing the size
         const textArr = (options.text.toString()).split('')
         const lines = []
         let curLine = []

         // Setup the lines
         for (const pos in textArr) {
            curLine.push(textArr[pos])

            if (this.surface.ctx.measureText(curLine.join('')).width > options.width) {
               // Try to find a space
               let o = curLine.length
               for (o; o > 0; o -= 1) {
                  if (curLine[o] === ' ') break
               }

               // If no space add a dash
               if (!o) {
                  o = curLine.length - 2
                  curLine.splice(o - 1, 0, '-')
               }

               // Draw and reset
               lines.push(curLine.slice(0, o).join('').trim())
               curLine = curLine.slice(o, curLine.length)
            }

            if (pos === textArr.length - 1) {
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
         const x = options.x - this.cameraX
         const y = options.y - this.cameraY
         const { scale } = this

         if (options.center) this.cs.draw.setTextCenter()

         if (options.lines) {
            for (const line in options.lines) {
               const lineYOffset = (line * (options.lineHeight || this.surface.ctx.lineHeight))
               this.surface.ctx.fillText(
                  options.lines[line],
                  x * scale,
                  (y + lineYOffset) * scale,
               )
            }
         } else {
            this.surface.ctx.fillText(
               options.text,
               Math.floor(x * scale),
               Math.floor(y * scale),
            )
         }
         this.settingsDefault()
      }

      textWidth(str) {
         return this.surface.ctx.measureText(str).width
      }

      line(options) {
         const { scale } = this
         const { lineWidth } = this.surface.ctx
         const lineWidthAdjust = lineWidth / 2 / scale

         const x1 = options.points[0].x * scale + lineWidthAdjust - this.cameraX * scale
         const x2 = options.points[1].x * scale + lineWidthAdjust - this.cameraX * scale
         const y1 = options.points[0].y * scale - lineWidthAdjust - this.cameraY * scale
         const y2 = options.points[1].y * scale - lineWidthAdjust - this.cameraY * scale

         this.surface.ctx.beginPath()
         this.surface.ctx.moveTo(x1, y1)
         this.surface.ctx.lineTo(x2, y2)
         this.surface.ctx.stroke()
         this.settingsDefault()
      }

      fillRect(args) {
         // console.log('drawing', args)
         const { scale } = this
         const width = this.cs.default(args.width, args.size)
         const height = this.cs.default(args.height, args.size)
         let { x, y } = args

         if (args.center) {
            x -= width / 2
            y -= height / 2
         }

         if (this.outside({ x: x, y: y, width: width, height: height })) {
            this.debug.rectanglesSkippedCount += 1
            this.settingsDefault()
            return
         }

         this.debug.rectanglesDrawnCount += 1

         this.surface.ctx.fillRect(
            (x - this.cameraX) * scale,
            (y - this.cameraY) * scale,
            width * scale,
            height * scale,
         )
         this.settingsDefault()
      }

      strokeRect(args) {
         const { scale } = this
         const { lineWidth } = this.surface.ctx
         const lineWidthAdjust = lineWidth / 2 / scale

         let x = args.x + lineWidthAdjust
         let y = args.y + lineWidthAdjust
         const width = this.cs.default(args.width, args.size) - lineWidthAdjust * 2
         const height = this.cs.default(args.height, args.size) - lineWidthAdjust * 2

         if (args.center) {
            x -= width / 2
            y -= height / 2
         }

         if (this.outside({ x: x, y: y, width: width, height: height })) {
            this.debug.rectanglesSkippedCount += 1
            this.settingsDefault()
            return
         }

         this.debug.rectanglesDrawnCount += 1

         this.surface.ctx.strokeRect(
            (x - this.cameraX) * scale,
            (y - this.cameraY) * scale,
            width * scale,
            height * scale,
         )

         this.settingsDefault()
      }

      circle(options) {
         const { radius, fill } = options
         const { scale } = this
         const x = options.pos ? options.pos.x : options.x
         const y = options.pos ? options.pos.y : options.y
         const start = (this.cs.default(options.start, 0) - 90) * (Math.PI / 180)
         const end = (this.cs.default(options.end, 360) - 90) * (Math.PI / 180)

         if (this.outside({
            x: x - radius,
            y: y - radius,
            width: radius * 2,
            height: radius * 2,
         })) {
            this.debug.circlesSkippedCount += 1
            this.settingsDefault()
            return
         }

         this.debug.circleDrawnCount += 1

         this.surface.ctx.beginPath()
         this.surface.ctx.arc(
            (x - this.cameraX) * scale,
            (y - this.cameraY) * scale,
            radius * scale,
            start,
            end,
         )

         if (fill) this.surface.ctx.fill()
         else this.surface.ctx.stroke()

         this.settingsDefault()
      }

      circleGradient(options) {
         const { scale } = this
         const { radius, colorStart, colorEnd } = options
         const x = options.x - this.cameraX
         const y = options.y - this.cameraY
         const g = this.surface.ctx.createRadialGradient(
            x * scale,
            y * scale,
            0,
            x * scale,
            y * scale,
            radius * scale,
         )

         g.addColorStop(1, colorEnd)
         g.addColorStop(0, colorStart)
         this.surface.ctx.fillStyle = g
         this.surface.ctx.beginPath()
         this.surface.ctx.arc(
            x * scale,
            y * scale,
            radius * scale,
            0, Math.PI * 2,
            true,
         )
         this.surface.ctx.closePath()
         this.surface.ctx.fill()
         this.settingsDefault()
      }

      shape(options) {
         const { vertices } = options
         const { scale } = this
         const relative = this.cs.default(options.relative, { x: 0, y: 0 })

         const bounds = { xmin: 0, ymin: 0, xmax: 0, ymax: 0 }
         for (let i = 0; i < vertices.length; i += 1) {
            bounds.xmin = Math.min(relative.x + vertices[i].x, bounds.xmin)
            bounds.ymin = Math.min(relative.y + vertices[i].y, bounds.ymin)
            bounds.xmax = Math.max(relative.x + vertices[i].x, bounds.xmax)
            bounds.ymax = Math.max(relative.y + vertices[i].y, bounds.ymax)
         }

         if (this.outside({
            x: bounds.xmin,
            y: bounds.ymin,
            width: bounds.xmax - bounds.xmin,
            height: bounds.ymax - bounds.ymin,
         })) {
            this.debug.shapesSkippedCount += 1
            this.settingsDefault()
            return
         }

         this.debug.shapesDrawnCount += 1

         this.surface.ctx.beginPath()
         this.surface.ctx.moveTo(
            (relative.x + vertices[0].x - this.cameraX) * scale,
            (relative.y + vertices[0].y - this.cameraY) * scale,
         )

         for (let i = 1; i < vertices.length; i += 1) {
            this.surface.ctx.lineTo(
               (relative.x + vertices[i].x - this.cameraX) * scale,
               (relative.y + vertices[i].y - this.cameraY) * scale,
            )
         }

         this.surface.ctx.closePath(
            (relative.x + vertices[0].x - this.cameraX) * scale,
            (relative.y + vertices[0].y - this.cameraY) * scale,
         )

         if (!options.fill) this.surface.ctx.stroke()
         if (options.fill) this.surface.ctx.fill()
         this.settingsDefault()
      }

      setColor(color) {
         if (this.surface.ctx.fillStyle === color && this.surface.ctx.strokeStyle === color) return
         this.surface.ctx.fillStyle = color
         this.surface.ctx.strokeStyle = color
      }

      setAlpha(alpha) {
         if (this.surface.ctx.globalAlpha === alpha) return
         this.surface.ctx.globalAlpha = alpha
      }

      setWidth(width) {
         if (this.surface.ctx.lineWidth === width * this.scale) return
         this.surface.ctx.lineWidth = width * this.scale
      }

      setFont(options) {
         if (
            this.surface.ctx.fontSize === options.size
            && this.surface.ctx.fontFamily === options.family
            && !this.surface.clear
         ) return

         if (options.size) this.surface.ctx.fontSize = options.size
         if (options.family) this.surface.ctx.fontFamily = options.family

         const effect = options.effect ? options.effect + ' ' : ''
         const { fontFamily } = this.surface.ctx
         const fontSize = this.surface.ctx.fontSize + 'px'
         this.surface.ctx.font = effect + ' ' + fontSize + ' ' + fontFamily
      }

      setLineHeight(height) {
         if (this.surface.ctx.lineHeight === height / this.scale) return
         this.surface.ctx.lineHeight = height / this.scale
      }

      setLineDash(lineDash) {
         this.surface.ctx.setLineDash(lineDash.map(d => d * this.scale))
      }

      setTextAlign(alignment) {
         if (this.surface.ctx.textAlign === alignment) return
         this.surface.ctx.textAlign = alignment
      }

      setTextBaseline(alignment) {
         if (this.surface.ctx.textBaseline === alignment) return
         this.surface.ctx.textBaseline = alignment
      }

      setTextCenter() {
         this.setTextAlign('center')
         this.setTextBaseline('middle')
      }

      setOperation(operation) {
         if (this.surface.ctx.globalCompositeOperation === operation) return
         this.surface.ctx.globalCompositeOperation = operation
      }

      settings(settings) {
         for (const setting in settings) {
            this.config.current[setting] = settings[setting]
         }
         this.settingsUpdate()
      }

      default(settings) {
         for (const setting in settings) {
            this.config.defaults[setting] = settings[setting]
         }

         this.settingsDefault()
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
         for (const setting in this.config.defaults) {
            this.config.current[setting] = this.config.defaults[setting]
         }

         if (this.surface) this.settingsUpdate()
      }
   }

   // export (node / web)
   if (typeof cs === 'undefined') module.exports = CSENGINE_DRAW
   else cs.draw = new CSENGINE_DRAW(cs) // eslint-disable-line no-undef
})()
