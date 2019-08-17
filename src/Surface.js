// -------------------------------------------------------------------------- //
// ----------------------------| CS ENGINE: SURFACE |------------------------ //
// -------------------------------------------------------------------------- //
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
         const canvas = document.createElement('canvas')

         const oneToOne = this.cs.default(config.oneToOne, true)
         const useCamera = this.cs.default(config.useCamera, true)
         const drawOutside = this.cs.default(config.drawOutside, false)
         const manualClear = this.cs.default(config.manualClear, false)

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
            clear: true,
         }

         // Add and fix size
         this.addToOrder(this.list[config.name])
         this.resize()

         // Return the element
         return this.list[config.name]
      }

      addToOrder(surface) {
         let i = 0
         for (i; i < this.order.length; i += 1) {
            if (this.order[i].depth > surface.depth) {
               break
            }
         }

         this.order.splice(i, 0, surface)
      }

      clearAll() {
         this.cs.ctx.clearRect(0, 0, this.cs.canvas.width, this.cs.canvas.height)
         for (const surface of this.order) {
            if (!surface.manualClear || surface.clearRequest) {
               let clearRect = {
                  x: 0, y: 0,
                  width: surface.canvas.width,
                  height: surface.canvas.height,
               }

               if (surface.clearRequest) clearRect = surface.clearRequest

               surface.ctx.clearRect(clearRect.x, clearRect.y, clearRect.width, clearRect.height)
               surface.clearRequest = undefined
               surface.clear = true
               continue
            }

            surface.clear = false
         }
      }

      clear(options) {
         const surface = this.list[options.name]
         surface.clearRequest = {
            x: options.x || 0,
            y: options.y || 0,
            width: options.width || surface.canvas.width,
            height: options.height || surface.canvas.height,
         }
      }

      displayAll() {
         let i = this.order.length
         while (i) {
            i -= 1
            this.display(this.order[i].name)
         }
      }

      display(surfaceName) {
         const surface = this.list[surfaceName]
         // destination
         let dx = 0
         let dy = 0
         let dWidth = this.cs.canvas.width
         let dHeight = this.cs.canvas.height

         // source
         let sx = dx
         let sy = dy
         let sWidth = dWidth
         let sHeight = dHeight

         if (!surface.oneToOne) {
            const cameraRect = this.cs.camera.info()
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
            (dx), (dy), (dWidth), (dHeight))
      }

      resize() {
         const width = this.cs.clampWidth
         const height = this.cs.clampHeight

         // set main canvas
         this.ctxImageSmoothing(this.cs.ctx)

         // loop over the surfaces to match
         // a surface can be raw (screen coordinates) or not (the size of the room)
         for (const surface of this.order) {
            let save = false
            if (this.cs.loop.run) {
               save = surface.ctx.getImageData(0, 0, surface.canvas.width, surface.canvas.height)
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
            height: this.list[surfaceName].height,
         }
      }

      debug(surfaceName) {
         const { canvas } = this.cs.surface.list[surfaceName]
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
   if (typeof module !== 'undefined') module.exports = CSENGINE_SURFACE
   else cs.surface = new CSENGINE_SURFACE(cs) // eslint-disable-line no-undef
})()
