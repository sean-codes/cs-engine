//---------------------------------------------------------------------------------------------//
//-----------------------------------| Sprite Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.sprite = {
   list: {},

   init: function(sprites) {
      for (var sprite of cs.sprites) {
         this.initSprite(sprite)
      }
   },

   exists: function(name) {
      return this.list[name] ? true : false
   },

   initSprite: function(options) {
      // create Sprite
      var width = options.fwidth || options.html.width
      var height = options.fheight || options.html.height
      var newSprite = {
         html: options.html,
         name: options.path.split('/').pop(),
         texture: document.createElement('canvas'),
         frames: options.frames || 1,
         fwidth: width,
         fheight: height,
         xoff: options.xoff || 0,
         yoff: options.yoff || 0,
         mask: {
            width: options.mask ? (options.mask.width || width - (options.mask.left || 0) - (options.mask.right || 0)) : width,
            height: options.mask ? (options.mask.height || height - (options.mask.top || 0) - (options.mask.bottom || 0)) : height
         },
         frames: []
      }

      // handle Frames
      var dx = 0
      var dy = 0
      
      while (dx < newSprite.html.width && dy < newSprite.html.height) {
         var frame = {}
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

      cs.sprite.list[newSprite.name] = newSprite
   },

   texture: function(spriteName, width, height) {
      var sprite = cs.sprite.list[spriteName]
      sprite.texture = document.createElement('canvas')
      sprite.texture.ctx = sprite.texture.getContext('2d')
      sprite.texture.width = width
      sprite.texture.height = height
      sprite.texture.fwidth = width
      sprite.texture.fheight = height

      var x = 0
      while (x < width) {
         var y = 0
         while (y < height) {
            sprite.texture.ctx.drawImage(sprite.html, x, y);
            y += sprite.html.height
         }
         x += sprite.html.width
      }
   },

   info: function(options) {
      // we need something to return info on sprites based on scale etc
      var sprite = this.list[options.spr]
      var frame = cs.default(options.frame, 0)
      var scaleX = cs.default(options.scaleX, 1)
      var scaleY = cs.default(options.scaleY, 1)
      var width = cs.default(options.width, sprite.fwidth)
      var height = cs.default(options.height, sprite.fheight)
      var angle = cs.default(options.angle, 0)
      var xoff = cs.default(options.xoff, sprite.xoff)
      var yoff = cs.default(options.yoff, sprite.yoff)

      if (options.size) {
         var tall = height > width
         var ratio = height / width

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
            height: sprite.mask.height
         }
      }
   }
}
