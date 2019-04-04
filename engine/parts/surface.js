//----------------------------------------------------------------------------//
//-------------------------------| Surfaces |---------------------------------//
//----------------------------------------------------------------------------//
/*
   Types of surfaces
      - GUI
         - matches device pixels
         - draw calls match pixels
      - GAME
         - matches device pixels
         - draw calls will offset by camera
      - MAP
         - matches room size
*/

cs.surface = {
   list: [],
   order: [],
   imageSmoothing: false,

   create: function(config) {
      var num = this.list.length
      var canvas = document.createElement("canvas")

      var oneToOne = cs.default(config.oneToOne, true)
      var useCamera = cs.default(config.useCamera, true)
      var drawOutside = cs.default(config.drawOutside, false)
      var manualClear = cs.default(config.manualClear, false)

      this.list[config.name] = {
         name: config.name,
         canvas: canvas,
         ctx: canvas.getContext('2d'),
         depth: cs.default(config.depth, 0),
         width: 0,
         height: 0,
         scale: 1,
         oneToOne: oneToOne,
         useCamera: useCamera,
         drawOutside: drawOutside,
         manualClear: manualClear,
         clearRequest: false,
         clear: true
      }

      // Add and fix size
      this.addToOrder(this.list[config.name])
      this.resize()

      // Return the element
      return this.list[config.name]
   },

   addToOrder: function(surface) {
      // Find Place to put it!
      for (var i = 0; i < this.order.length; i++) {
         if (this.order[i].depth > surface.depth) {
            break
         }
      }

      this.order.splice(i, 0, surface)
   },

   clearAll: function() {
      cs.ctx.clearRect(0, 0, cs.canvas.width, cs.canvas.height)
      for (var surface of this.order) {
         if (!surface.manualClear || surface.clearRequest) {
            var clearRect = { x: 0, y: 0, width: surface.canvas.width, height: surface.canvas.height }

            if (surface.clearRequest)
               clearRect = surface.clearRequest

            surface.ctx.clearRect(clearRect.x, clearRect.y, clearRect.width, clearRect.height)
            surface.clearRequest = undefined
            surface.clear = true
            continue
         }

         surface.clear = false
      }
   },

   clear: function(options) {
      var surface = this.list[options.name]
      surface.clearRequest = {
         x: options.x || 0,
         y: options.y || 0,
         width: options.width || surface.canvas.width,
         height: options.height || surface.canvas.height
      }
   },

   displayAll: function() {
      var i = this.order.length;
      while (i--) {
         this.display(this.order[i].name)
      }
   },

   display: function(surfaceName) {
      var surface = this.list[surfaceName]
      // destination
      var dx = 0
      var dy = 0
      var dWidth = cs.canvas.width
      var dHeight = cs.canvas.height

      // source
      var sx = dx
      var sy = dy
      var sWidth = dWidth
      var sHeight = dHeight

      if (!surface.oneToOne) {
         var cameraRect = cs.camera.info()
         sx = cameraRect.x
         sy = cameraRect.y
         sWidth = cameraRect.width
         sHeight = cameraRect.height

         // safari does not allow negative source
         if (sy < 0) {
            dy -= sy * cameraRect.scale
            sy = 0
            sHeight = surface.height
            dHeight = sHeight * cameraRect.scale
         }

         if (sx < 0) {
            dx -= sx * cameraRect.scale
            sx = 0
            sWidth = surface.width
            dWidth = sWidth * cameraRect.scale
         }
      }

      // zooming (what a hack)
      if (surface.useCamera) {
         var camera = cs.camera.info()
         if (camera.zoom > 1) {
            var expand = camera.zoom * dWidth - dWidth
            dx -= expand
            dWidth += expand * 2

            var expand = camera.zoom * dHeight - dHeight
            dy -= expand
            dHeight += expand * 2

            // helps sync up scaled surfaces with unscaled
            if (surface.oneToOne && camera.scale > 1) {
               dy += 1
            }
         }
      }

      cs.ctx.drawImage(surface.canvas,
         sx, sy, sWidth, sHeight,
         (dx), (dy), (dWidth), (dHeight)
      )
   },

   resize: function() {
      var width = cs.clampWidth
      var height = cs.clampHeight

      // set main canvas
      this.ctxImageSmoothing(cs.ctx)

      // loop over the surfaces to match
      // a surface can be raw (screen coordinates) or not (the size of the room)
      for (var surface of this.order) {
         if (cs.loop.run) {
            var save = surface.ctx.getImageData(0, 0, surface.canvas.width, surface.canvas.height)
         }

         surface.canvas.width = surface.oneToOne ? width : cs.room.width
         surface.canvas.height = surface.oneToOne ? height : cs.room.height
         surface.width = surface.canvas.width
         surface.height = surface.canvas.height
         this.clear({ name: surface.name })
         this.ctxImageSmoothing(surface.ctx)

         if (cs.loop.run) surface.ctx.putImageData(save, 0, 0)
      }
   },

   ctxImageSmoothing: function(ctx) {
      ctx.webkitImageSmoothingEnabled = this.imageSmoothing
      ctx.mozImageSmoothingEnabled = this.imageSmoothing
      ctx.msImageSmoothingEnabled = this.imageSmoothing
      ctx.imageSmoothingEnabled = this.imageSmoothing
   },

   info: function(surfaceName) {
      return {
         canvas: this.list[surfaceName].canvas,
         width: this.list[surfaceName].width,
         height: this.list[surfaceName].height
      }
   },

   debug: function(surfaceName) {
      var canvas = cs.surface.list[surfaceName].canvas
      canvas.style.position = 'fixed'
      canvas.style.top = '50%'
      canvas.style.left = '50%'
      canvas.style.transform = 'translateX(-50%) translateY(-50%)'
      canvas.style.background = '#222'
      canvas.style.border = '2px solid #000'

      document.body.appendChild(canvas)
   }
}
