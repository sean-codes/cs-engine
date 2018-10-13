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
      // Create Sprite
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
            x: options.mask ? (options.mask.x || options.mask.left || 0) : 0,
            y: options.mask ? (options.mask.y || options.mask.top || 0) : 0,
            width: options.mask ? (options.mask.width || width - (options.mask.left || 0) - (options.mask.right || 0)) : width,
            height: options.mask ? (options.mask.height || height - (options.mask.top || 0) - (options.mask.bottom || 0)) : height
         },
         frames: []
      }

      // Handle Frames
      var dx = 0,
         dy = 0
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
      // We need something to return info on sprites based on scale etc
      if (typeof options.frame == 'undefined') options.frame = 0
      if (typeof options.scaleX == 'undefined') options.scaleX = 1
      if (typeof options.scaleY == 'undefined') options.scaleY = 1
      var sprite = this.list[options.spr]
      var tallSprite = sprite.fheight > sprite.fwidth
      var hRatio = tallSprite ? sprite.fwidth / sprite.fheight : 1
      var vRatio = tallSprite ? 1 : sprite.fheight / sprite.fwidth

      if (options.scale) {
         options.scaleX = options.scale
         options.scaleY = options.scale
      }
      // Scaling with width/height
      if (options.width || options.size)
         options.scaleX = (options.width || options.size) / sprite.fwidth * hRatio
      if (options.height || options.size)
         options.scaleY = (options.height || options.size) / sprite.fheight * vRatio

      // Locking aspect ratio
      if (options.aspectLock)
         (options.scaleX !== 1) ?
         options.scaleY = options.scaleX :
         options.scaleX = options.scaleY

      return {
         width: (options.texture ? sprite.texture.fwidth : sprite.fwidth) * options.scaleX,
         height: (options.texture ? sprite.texture.fheight : sprite.fheight) * options.scaleY,
         scaleX: options.scaleX,
         scaleY: options.scaleY,
         xoff: sprite.xoff,
         yoff: sprite.yoff,
         frames: options.texture ? [sprite.texture] : sprite.frames,
         frame: options.frame,
         mask: {
            x: sprite.mask.x,
            y: sprite.mask.y,
            width: sprite.mask.width,
            height: sprite.mask.height
         }
      }
   }
}
