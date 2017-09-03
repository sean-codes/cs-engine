//---------------------------------------------------------------------------------------------//
//-----------------------------------| Sprite Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.sprite = {
   list: {},
   order: [],
   render: function(sprites){
      for(var sprite of cs.sprites){
         this.loadSprite(sprite)
      }
   },
   renderSprite: function(options){
      cs.load.add()
      var sprName = options.path.split('/').pop()

      //Set up
      cs.sprite.list[sprName] = new Image()
      cs.sprite.list[sprName].src = options.path + '.png'
      cs.sprite.list[sprName].frames = []

      //Frame Width/Height/Tile
      cs.sprite.list[sprName].texture = options.texture
      cs.sprite.list[sprName].frames = options.frames || 1
      cs.sprite.list[sprName].fwidth = options.fwidth || 0
      cs.sprite.list[sprName].fheight = options.fheight || 0
      cs.sprite.list[sprName].xoff = options.xoff || 0
      cs.sprite.list[sprName].yoff = options.yoff || 0

      var that = this
      cs.sprite.list[sprName].onload = function(){
         // Set up
         if(this.fwidth == 0)
            this.fwidth = this.width
         if(this.fheight == 0)
            this.fheight = this.height

         // Create Frames
         this.frames = []
         var dx = 0, dy = 0
         while(dx < this.width && dy < this.height){
            var frame = {}
            frame.canvas = document.createElement('canvas')
            frame.canvas.width = this.fwidth
            frame.canvas.height = this.fheight
            frame.canvas.ctx = frame.canvas.getContext('2d')

            frame.canvas.ctx.drawImage(this, dx, dy, this.fwidth, this.fheight,
               0, 0, this.fwidth, this.fheight)
            this.frames.push(frame.canvas)
            dx += this.fwidth
            if(dx === this.width)
               dx = 0, dy+= this.fwidth
         }

         for(var surface of cs.surface.order)
            surface.clear = false

         cs.load.check()
      }
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
      if(options.width)
         options.scaleX = options.width/sprite.fwidth
      if(options.height)
         options.scaleY = options.height/sprite.fheight

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
