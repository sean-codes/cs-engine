//----------------------------------------------------------------------------//
//-----------------------------| CS ENGINE: SURFACE |-------------------------//
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
(() => {
   class CSENGINE_SURFACE {
      constructor(cs) {
         this.cs = cs

         this.list = {}
         this.order = []
         this.imageSmoothing = false
      }

      create(config) {
         var num = this.list.length
         var canvas = document.createElement("canvas")

         var oneToOne = this.cs.default(config.oneToOne, true)
         var useCamera = this.cs.default(config.useCamera, true)
         var drawOutside = this.cs.default(config.drawOutside, false)
         var manualClear = this.cs.default(config.manualClear, false)

         this.list[config.name] = {
            name: config.name,
            canvas: canvas,
            ctx: canvas.getContext('2d'),
            depth: this.cs.default(config.depth, 0),
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
      }

      addToOrder(surface) {
         // Find Place to put it!
         for (var i = 0; i < this.order.length; i++) {
            if (this.order[i].depth > surface.depth) {
               break
            }
         }

         this.order.splice(i, 0, surface)
      }

      clearAll() {
         this.cs.ctx.clearRect(0, 0, this.cs.canvas.width, this.cs.canvas.height)
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
      }

      clear(options) {
         var surface = this.list[options.name]
         surface.clearRequest = {
            x: options.x || 0,
            y: options.y || 0,
            width: options.width || surface.canvas.width,
            height: options.height || surface.canvas.height
         }
      }

      displayAll() {
         var i = this.order.length;
         while (i--) {
            this.display(this.order[i].name)
         }
      }

      display(surfaceName) {
         var surface = this.list[surfaceName]
         // destination
         var dx = 0
         var dy = 0
         var dWidth = this.cs.canvas.width
         var dHeight = this.cs.canvas.height

         // source
         var sx = dx
         var sy = dy
         var sWidth = dWidth
         var sHeight = dHeight

         if (!surface.oneToOne) {
            var cameraRect = this.cs.camera.info()
            sx = cameraRect.x
            sy = cameraRect.y
            sWidth = cameraRect.width
            sHeight = cameraRect.height

            // safari does not allow negative source
            if (sy < 0) {
               dy -= sy * cameraRect.zScale
               sy = 0
               sHeight = surface.height
               dHeight = sHeight * cameraRect.zScale
            }

            if (sx < 0) {
               dx -= sx * cameraRect.zScale
               sx = 0
               sWidth = surface.width
               dWidth = sWidth * cameraRect.zScale
            }
         }

         this.cs.ctx.drawImage(surface.canvas,
            sx, sy, sWidth, sHeight,
            (dx), (dy), (dWidth), (dHeight)
         )
      }

      resize() {
         var width = this.cs.clampWidth
         var height = this.cs.clampHeight

         // set main canvas
         this.ctxImageSmoothing(this.cs.ctx)

         // loop over the surfaces to match
         // a surface can be raw (screen coordinates) or not (the size of the room)
         for (var surface of this.order) {
            if (this.cs.loop.run) {
               var save = surface.ctx.getImageData(0, 0, surface.canvas.width, surface.canvas.height)
            }

            surface.canvas.width = surface.oneToOne ? width : this.cs.room.width
            surface.canvas.height = surface.oneToOne ? height : this.cs.room.height
            surface.width = surface.canvas.width
            surface.height = surface.canvas.height
            this.clear({ name: surface.name })
            this.ctxImageSmoothing(surface.ctx)

            if (this.cs.loop.run) surface.ctx.putImageData(save, 0, 0)
         }
      }

      ctxImageSmoothing(ctx) {
         ctx.webkitImageSmoothingEnabled = this.imageSmoothing
         ctx.mozImageSmoothingEnabled = this.imageSmoothing
         ctx.msImageSmoothingEnabled = this.imageSmoothing
         ctx.imageSmoothingEnabled = this.imageSmoothing
      }

      info(surfaceName) {
         return {
            canvas: this.list[surfaceName].canvas,
            width: this.list[surfaceName].width,
            height: this.list[surfaceName].height
         }
      }

      debug(surfaceName) {
         var canvas = this.cs.surface.list[surfaceName].canvas
         canvas.style.position = 'fixed'
         canvas.style.top = '50%'
         canvas.style.left = '50%'
         canvas.style.transform = 'translateX(-50%) translateY(-50%)'
         canvas.style.background = '#222'
         canvas.style.border = '2px solid #000'

         document.body.appendChild(canvas)
      }
   }

   // export (node / web)
   typeof module !== 'undefined' ? module.exports = CSENGINE_SURFACE : cs.surface = new CSENGINE_SURFACE(cs)
})()
