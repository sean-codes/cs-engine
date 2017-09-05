//---------------------------------------------------------------------------------------------//
//-----------------------------------| Sprite Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.sprite = {
   list: {},
   order: [],
   init: function(sprites){
      for(var sprite of cs.sprites){
         this.initSprite(sprite)
      }
   },
   initSprite: function(options){

      // Create Sprite
      var newSprite = {
         html: options.html,
         name: options.path.split('/').pop(),
         texture: options.texture,
         frames: options.frames || 1,
         fwidth: options.fwidth || options.html.width,
         fheight: options.fheight || options.html.height,
         xoff: options.xoff || 0,
         yoff: options.yoff || 0,
         frames : []
      }

      // Handle Frames
      var dx = 0, dy = 0
      while(dx < newSprite.html.width && dy < newSprite.html.height){
         var frame = {}
         frame.canvas = document.createElement('canvas')
         frame.canvas.width = newSprite.fwidth
         frame.canvas.height = newSprite.fheight
         frame.canvas.ctx = frame.canvas.getContext('2d')

         frame.canvas.ctx.drawImage(newSprite.html, dx, dy, newSprite.fwidth, newSprite.fheight,
            0, 0, newSprite.fwidth, newSprite.fheight)
         newSprite.frames.push(frame.canvas)

         dx += newSprite.fwidth
         if(dx === newSprite.html.width){
            dx = 0
            dy += newSprite.fwidth
         }
      }

      cs.sprite.list[newSprite.name] = newSprite
   },
   texture: function(spriteName, width, height){
      var sprite = cs.sprite.list[spriteName]
      sprite.frames[0].width = width
      sprite.frames[0].height = height
      sprite.fwidth = width
      sprite.fheight = height
      sprite.frames[0].ctx.clearRect(0, 0, width, height)
      var x = 0
      while(x < width){
         var y = 0
         while(y < height){
            sprite.frames[0].ctx.drawImage(sprite, x, y)
            y += sprite.height
         }
         x+= sprite.width
      }
   },
   info: function(options){
      // We need something to return info on sprites based on scale etc
      if(typeof options.frame == 'undefined') options.frame = 0
      if(typeof options.scaleX == 'undefined') options.scaleX = 1
      if(typeof options.scaleY == 'undefined') options.scaleY = 1
      var sprite = this.list[options.spr]
      if(options.scale){
         options.scaleX = options.scale
         options.scaleY = options.scale
      }
      // Scaling with width/height
      if(options.width || options.size)
         options.scaleX = (options.width || options.size)/sprite.fwidth
      if(options.height || options.size)
         options.scaleY = (options.height || options.size)/sprite.fheight

      // Locking aspect ratio
      if(options.aspectLock)
         (options.scaleX !== 1)
            ? options.scaleY = options.scaleX
            : options.scaleX = options.scaleY

      return {
         width: sprite.fwidth * options.scaleX,
         height: sprite.fheight * options.scaleY,
         scaleX: options.scaleX,
         scaleY: options.scaleY,
         frames: sprite.frames,
         frame: options.frame
      }
   }
}
