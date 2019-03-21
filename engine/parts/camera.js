//---------------------------------------------------------------------------------------------//
//----------------------------------| Camera Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.camera = {
   x: 0,
   y: 0,
   followPos: { x: 0, y: 0 },
   scale: 1,
   width: 0,
   height: 0,
   maxWidth: 0,
   maxHeight: 0,
   smoothing: 1,
   config: {
      maxWidth: 0,
      maxHeight: 0,
      scale: 1,
      smoothing: 1 // 1 means 1:1 movement
   },

   setup: function(options) {
      // use scale
      for (var option in options) {
         this.config[option] = options[option]
      }

      this.maxWidth = this.config.maxWidth
      this.maxHeight = this.config.maxHeight
      this.smoothing = this.config.smoothing
      this.scale = this.config.scale

      cs.resize()
   },

   resize: function() {
      var w = cs.canvas.width
      var h = cs.canvas.height

      if (this.maxWidth && this.maxHeight) {
         this.scale = Math.ceil(w / this.maxWidth)
         if (this.scale < h / this.maxHeight) {
            this.scale = Math.ceil(h / this.maxHeight)
         }
      }

      this.width = w / this.scale
      this.height = h / this.scale
   },

   snap: function(pos) {
      this.follow(pos)
      this.update(1)
   },

   follow: function(pos) {
      this.followPos = {
         x: pos.x,
         y: pos.y
      }
   },

   update: function(smoothing) {
      smoothing = cs.default(smoothing, this.smoothing)

      var differenceX = this.followPos.x - (this.x + this.width / 2)
      var differenceY = this.followPos.y - (this.y + this.height / 2)

      this.x = this.x + differenceX / smoothing
      this.y = this.y + differenceY / smoothing

      if (this.x < 0) this.x = 0
      if (this.y < 0) this.y = 0

      if (this.x + this.width > cs.room.width)
         this.x = (cs.room.width - this.width) / (cs.room.width < this.width ? 2 : 1)

      if (this.y + this.height > cs.room.height)
         this.y = (cs.room.height - this.height) / (cs.room.height < this.height ? 2 : 1)
   },

   zoomOut: function() {},
   zoomIn: function() {},

   outside: function(rect) {
      if (
         rect.x + rect.width < this.x || rect.x > this.x + this.width
         || rect.y + rect.height < this.y || rect.y > this.y + this.height
      ) {
         return true
      }
      return false
   },

   rect: function() {
      return {
         x: Math.floor(this.x * this.scale),
         y: Math.floor(this.y * this.scale),
         width: this.width * this.scale,
         height: this.height * this.scale
      }
   }
}
