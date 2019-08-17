// -------------------------------------------------------------------------- //
// -----------------------------| CS ENGINE: SPRITE |------------------------ //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_SPRITE {
      constructor(cs) {
         this.cs = cs
         this.list = {}
      }

      init() {
         for (const sprite of this.cs.sprites) {
            this.initSprite(sprite)
         }
      }

      initSprite(options) {
         // create Sprite
         const width = this.cs.default(options.fwidth, options.html.width)
         const height = this.cs.default(options.fheight, options.html.height)

         let maskWidth = width
         let maskHeight = height

         if (options.mask) {
            if (options.mask.width) maskWidth = options.maskWidth
            else maskWidth = width - (options.mask.left || 0) - (options.mask.right || 0)

            if (options.mask.height) maskHeight = options.maskHeight
            else maskHeight = height - (options.mask.top || 0) - (options.mask.bottom || 0)
         }

         const newSprite = {
            html: options.html,
            name: options.name || options.path.split('/').pop(),
            texture: document.createElement('canvas'),
            fwidth: width,
            fheight: height,
            xoff: options.xoff || 0,
            yoff: options.yoff || 0,
            mask: {
               width: maskWidth,
               height: maskHeight,
            },
            frames: [],
         }

         // handle Frames
         let dx = 0
         let dy = 0

         while (dx < newSprite.html.width && dy < newSprite.html.height) {
            const frame = {}
            frame.canvas = document.createElement('canvas')
            frame.canvas.width = newSprite.fwidth
            frame.canvas.height = newSprite.fheight
            frame.canvas.ctx = frame.canvas.getContext('2d')

            frame.canvas.ctx.drawImage(newSprite.html, dx, dy, newSprite.fwidth, newSprite.fheight,
               0, 0, newSprite.fwidth, newSprite.fheight)
            newSprite.frames.push(frame.canvas)

            dx += newSprite.fwidth
            if (dx === newSprite.html.width) {
               dx = 0
               dy += newSprite.fheight
            }
         }

         this.cs.sprite.list[newSprite.name] = newSprite
      }

      texture(spriteName, width, height) {
         const sprite = this.cs.sprite.list[spriteName]
         sprite.texture = document.createElement('canvas')
         sprite.texture.ctx = sprite.texture.getContext('2d')
         sprite.texture.width = width
         sprite.texture.height = height
         sprite.texture.fwidth = width
         sprite.texture.fheight = height

         let x = 0
         while (x < width) {
            let y = 0
            while (y < height) {
               sprite.texture.ctx.drawImage(sprite.html, x, y)
               y += sprite.html.height
            }
            x += sprite.html.width
         }
      }

      info(options) {
         // we need something to return info on sprites based on scale etc
         const sprite = this.list[options.spr]
         const frame = this.cs.default(options.frame, 0)
         const scaleX = this.cs.default(options.scaleX, 1)
         const scaleY = this.cs.default(options.scaleY, 1)
         const angle = this.cs.default(options.angle, 0)
         let width = this.cs.default(options.width, sprite.fwidth)
         let height = this.cs.default(options.height, sprite.fheight)
         let xoff = this.cs.default(options.xoff, sprite.xoff)
         let yoff = this.cs.default(options.yoff, sprite.yoff)

         if (options.size) {
            const tall = height > width
            const ratio = height / width

            width = tall ? options.size / ratio : options.size
            height = tall ? options.size : options.size * ratio
         }

         if (options.xCenter) xoff = width / 2
         if (options.yCenter) yoff = height / 2
         if (options.center) {
            xoff = width / 2
            yoff = height / 2
         }

         return {
            name: options.spr,
            fWidth: sprite.fwidth,
            fHeight: sprite.fheight,
            width: (options.texture ? sprite.texture.fwidth : width),
            height: (options.texture ? sprite.texture.fheight : height),
            scaleX: scaleX,
            scaleY: scaleY,
            angle: angle,
            xoff: xoff,
            yoff: yoff,
            frames: options.texture ? [sprite.texture] : sprite.frames,
            frame: sprite.frames[frame],
            mask: {
               width: sprite.mask.width,
               height: sprite.mask.height,
            },
         }
      }

      exists(name) {
         return this.list[name]
      }
   }

   if (typeof module !== 'undefined') module.exports = CSENGINE_SPRITE
   else cs.sprite = new CSENGINE_SPRITE(cs) // eslint-disable-line no-undef
})()
