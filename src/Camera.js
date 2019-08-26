// -------------------------------------------------------------------------- //
// ----------------------------| CS ENGINE: CAMERA |------------------------- //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_CAMERA {
      constructor(cs) {
         this.cs = cs

         this.x = 0
         this.y = 0
         this.centerX = 0
         this.centerY = 0
         this.followPos = { x: 0, y: 0 }
         this.zoom = 1
         this.targetZoom = 1
         this.scale = 1
         this.width = 0
         this.height = 0
         this.maxWidth = 0
         this.maxHeight = 0
         this.smoothing = 1
         this.smoothingZoom = 1

         this.config = {
            maxWidth: 0,
            maxHeight: 0,
            scale: 1,
            zoom: 1,
            smoothing: 1, // 1 means 1:1 movement
            smoothingZoom: 1,
            fixedScaling: true,
         }
      }

      // should happen once
      setup(options) {
         this.configure(options)
         this.scale = this.config.scale
         this.maxWidth = this.config.maxWidth
         this.maxHeight = this.config.maxHeight
         this.cs.resize()
      }

      // can change anytime (zoom, smoothing, etc)
      configure({
         zoom,
         scale,
         maxWidth,
         maxHeight,
         smoothing,
         smoothingZoom,
         fixedScaling,
      }) {
         this.config.maxWidth = this.cs.default(maxWidth, this.config.maxWidth)
         this.config.maxHeight = this.cs.default(maxHeight, this.config.maxHeight)
         this.config.scale = this.cs.default(scale, this.config.scale)
         this.config.zoom = this.cs.default(zoom, this.config.zoom)
         this.config.smoothing = this.cs.default(smoothing, this.config.smoothing)
         this.config.smoothingZoom = this.cs.default(smoothingZoom, this.config.smoothingZoom)
         this.config.fixedScaling = this.cs.default(fixedScaling, this.config.fixedScaling)

         this.smoothing = this.config.smoothing
         this.smoothingZoom = this.config.smoothingZoom
      }

      resize() {
         const w = this.cs.canvas.width
         const h = this.cs.canvas.height

         if (this.maxWidth && this.maxHeight) {
            this.scale = this.config.fixedScaling
               ? Math.max(1, Math.ceil(h / this.maxHeight))
               : h / this.maxHeight

            if (this.scale < w / this.maxWidth) {
               this.scale = this.config.fixedScaling
                  ? Math.max(1, Math.ceil(w / this.maxWidth))
                  : w / this.maxWidth
            }
         }

         this.width = w / this.scale
         this.height = h / this.scale
      }

      snap({ x, y }) {
         this.follow({ x, y })
         this.update(1)
      }

      follow({ x, y }) {
         this.followPos = {
            x: x,
            y: y,
         }
      }

      update(smoothing) {
         smoothing = this.cs.default(smoothing, this.smoothing)

         // smooth zooming
         const differenceZoom = this.config.zoom - this.zoom
         this.zoom += differenceZoom / this.smoothingZoom
         // if zooming turn smoothing off
         if (differenceZoom) smoothing = 1

         const scale = this.info().zScale
         this.width = this.cs.canvas.width / scale
         this.height = this.cs.canvas.height / scale

         const differenceX = this.followPos.x - (this.x + this.width / 2)
         const differenceY = this.followPos.y - (this.y + this.height / 2)

         this.x = this.x + differenceX / smoothing
         this.y = this.y + differenceY / smoothing

         if (this.x < 0) this.x = 0
         if (this.y < 0) this.y = 0

         if (this.x + this.width > this.cs.room.width) {
            this.x = (this.cs.room.width - this.width)
               / (this.cs.room.width < this.width ? 2 : 1)
         }

         if (this.y + this.height > this.cs.room.height) {
            this.y = (this.cs.room.height - this.height)
               / (this.cs.room.height < this.height ? 2 : 1)
         }

         this.centerX = this.x + this.width / 2
         this.centerY = this.y + this.height / 2
      }

      zoomOut() {
         if (this.config.zoom >= 2) this.config.zoom -= 1
      }

      zoomIn() {
         this.config.zoom += 1
      }

      outside({ x, y, width, height }) {
         if (x + width < this.x
            || x > this.x + this.width
            || y + height < this.y
            || y > this.y + this.height
         ) {
            return true
         }
         return false
      }

      info() {
         return {
            zoom: Math.round(this.zoom * 1000) / 1000,
            scale: Math.round(this.scale * 1000) / 1000,
            zScale: Math.round(this.scale * this.zoom * 1000) / 1000,
            x: Math.round(this.x * 1000) / 1000 - 0.005, // prevent 0.5 artifacts
            y: Math.round(this.y * 1000) / 1000 - 0.005,
            width: Math.round(this.width * 1000 + 0.010) / 1000,
            height: Math.round(this.height * 1000 + 0.010) / 1000,
         }
      }
   }

   // export (node / web)
   if (typeof cs === 'undefined') module.exports = CSENGINE_CAMERA
   else cs.camera = new CSENGINE_CAMERA(cs) // eslint-disable-line no-undef
})()
