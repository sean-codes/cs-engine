//---------------------------------------------------------------------------------------------//
//----------------------------------| Surface Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.surface = {
   list: [],
   order: [],
   imageSmoothing: false,
   maxRes: 10000,
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
         if (this.order[i].depth > surface.depth)
            break
      }
      this.order.splice(i, 0, surface)
   },
   clearAll: function() {
      cs.ctx.clearRect(0, 0, cs.canvas.width, cs.canvas.height)
      for (var surface of this.order) {
         if (!surface.manualClear || surface.clearRequest) {
            clearRect = {
               x: surface.raw ? 0 : Math.floor(cs.camera.x),
               y: surface.raw ? 0 : Math.floor(cs.camera.y),
               width: surface.raw ? surface.canvas.width : cs.camera.width,
               height: surface.raw ? surface.canvas.height : cs.camera.height,
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
      sx = surface.raw ? 0 : cs.camera.x,
         sy = surface.raw ? 0 : cs.camera.y,
         sWidth = surface.raw ? surface.canvas.width : cs.camera.width,
         sHeight = surface.raw ? surface.canvas.height : cs.camera.height,

         //We will have to scale the X over becuse safari doesnt act like chrome
         dx = sx < 0 ? Math.floor(cs.camera.scale * (cs.camera.x * -1)) : 0,
         dy = sy < 0 ? Math.floor(cs.camera.scale * (cs.camera.y * -1)) : 0,
         dWidth = sWidth <= surface.canvas.width ?
         cs.canvas.width :
         cs.canvas.width - Math.floor(cs.camera.scale * ((cs.camera.width) - surface.canvas.width)),
         dHeight = sHeight <= surface.canvas.height ?
         cs.canvas.height :
         cs.canvas.height - Math.floor(cs.camera.scale * ((cs.camera.height) - surface.canvas.height))

      if (sx < 0) { sx = 0;
         sWidth += sx * -1 }
      if (sy < 0) { sy = 0;
         sHeight += sy * -1 }
      if (sWidth > surface.canvas.width) sWidth = surface.canvas.width
      if (sHeight > surface.canvas.height) sHeight = surface.canvas.height

      cs.ctx.drawImage(surface.canvas,
         sx, sy, sWidth, sHeight,
         dx, dy, dWidth, dHeight)
   },
   resize: function() {
      var viewSize = cs.canvas.getBoundingClientRect()

      var w = viewSize.width
      var h = viewSize.height
      var ratioHeight = w / h //How many h = w
      var ratioWidth = h / w //how man w = a h


      cs.canvas.width = w
      cs.canvas.height = h
      this.ctxImageSmoothing(cs.ctx)

      for (var surface of this.order) {
         var img = surface.ctx.getImageData(0, 0, surface.canvas.width, surface.canvas.height)
         surface.canvas.width = surface.raw ? w : cs.room.width
         surface.canvas.height = surface.raw ? h : cs.room.height
         surface.width = surface.canvas.width
         surface.height = surface.canvas.height
         surface.ctx.putImageData(img, 0, 0)
         this.ctxImageSmoothing(surface.ctx)
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
