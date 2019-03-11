//---------------------------------------------------------------------------------------------//
//----------------------------------| Surface Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.surface = {
   list: [],
   order: [],
   imageSmoothing: false,

   create: function(info) {
      var num = this.list.length
      var canvas = document.createElement("canvas")
      canvas.width = cs.canvas.width
      canvas.height = cs.canvas.height

      this.list[info.name] = {
         name: info.name,
         canvas: canvas,
         ctx: canvas.getContext('2d'),
         depth: cs.default(info.depth, 0),
         width: canvas.width,
         height: canvas.height,
         raw: cs.default(info.raw, false),
         scale: true,
         draw: true,
         drawOutside: cs.default(info.drawOutside, false),
         manualClear: cs.default(info.manualClear, false),
         append: cs.default(info.append, false),
         clearRequest: false,
         clear: false
      }

      // Add and fix size
      this.addToOrder(this.list[info.name])
      cs.surface.resize()

      // Return the element
      return this.list[info.name]
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
            clearRect = {
               x: surface.raw ? 0 : Math.floor(cs.camera.x * cs.camera.scale),
               y: surface.raw ? 0 : Math.floor(cs.camera.y * cs.camera.scale),
               width: surface.raw ? surface.canvas.width : Math.ceil(cs.camera.width * cs.camera.scale),
               height: surface.raw ? surface.canvas.height : Math.ceil(cs.camera.height * cs.camera.scale),
            }

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

      // source
      var sx = 0
      var sy = 0
      var sWidth = surface.canvas.width
      var sHeight = surface.canvas.height

      if (!surface.raw) {
         sx = Math.max(cs.camera.x * cs.camera.scale, 0)
         sy = Math.max(cs.camera.y * cs.camera.scale, 0)
         sWidth = Math.min(cs.camera.width * cs.camera.scale, surface.width - sx)
         sHeight = Math.min(cs.camera.height * cs.camera.scale, surface.height - sy)
      }

      // destination
      var dx = 0
      var dy = 0
      var dWidth = cs.canvas.width
      var dHeight = cs.canvas.height

      if (sWidth < dWidth) {
         dWidth = sWidth
         dx = cs.canvas.width/2 - sWidth/2
      }

      if (sHeight < dHeight) {
         dHeight = sHeight
         dy = cs.canvas.height/2 - sHeight/2
      }

      cs.ctx.drawImage(surface.canvas,
         Math.floor(sx), Math.floor(sy), Math.round(sWidth), Math.round(sHeight),
         Math.round(dx), Math.round(dy), Math.ceil(dWidth), Math.ceil(dHeight)
      )
   },

   resize: function() {
      // parent canvas info
      var w = cs.canvas.width
      var h = cs.canvas.height

      // set main canvas
      cs.canvas.width = w
      cs.canvas.height = h
      this.ctxImageSmoothing(cs.ctx)

      // loop over the surfaces to match
      // a surface can be raw (screen coordinates) or not (the size of the room)
      for (var surface of this.order) {
         if (cs.loop.run) {
            var save = surface.ctx.getImageData(0, 0, surface.canvas.width, surface.canvas.height)
         }
         surface.canvas.width = surface.raw ? w : (cs.room.width * cs.camera.scale)
         surface.canvas.height = surface.raw ? h : (cs.room.height * cs.camera.scale)
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
         width: this.list[surfaceName].width,
         height: this.list[surfaceName].height
      }
   }
}
