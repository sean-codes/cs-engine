//---------------------------------------------------------------------------------------------//
//----------------------------------| Camera Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.camera = {
   x: 0,
   y: 0,
   followPos: { x: 0, y: 0 },
   zoom: 1,
   targetZoom: 1,
   scale: 1,
   width: 0,
   height: 0,
   maxWidth: 0,
   maxHeight: 0,
   smoothing: 1,
   smoothingZoom: 1,

   config: {
      maxWidth: 0,
      maxHeight: 0,
      scale: 1,
      zoom: 1,
      smoothing: 1, // 1 means 1:1 movement
      smoothingZoom: 1,
      fixedScaling: true
   },

   // should only change once
   setup: function(options) {
      this.configure(options)
      this.scale = this.config.scale
      this.maxWidth = this.config.maxWidth
      this.maxHeight = this.config.maxHeight
      cs.resize()
   },

   // can change anytime (zoom, smoothing, etc)
   configure: function(options) {
      for (var option in options) {
         this.config[option] = options[option]
      }

      this.smoothing = this.config.smoothing
      this.smoothingZoom = this.config.smoothingZoom
   },

   resize: function() {
      var w = cs.canvas.width
      var h = cs.canvas.height

      if (this.maxWidth && this.maxHeight) {
         this.scale = this.config.fixedScaling
            ? Math.max(1, Math.ceil(h / this.maxHeight))
            : h / this.maxHeight

         if (this.scale < w / this.maxWidth) {
            this.scale = this.config.fixedScaling
               ? Math.max(1, Math.ceil(w / this.maxWidth))
               : w / this.maxWidth
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

      // zooming
      var differenceZoom = this.config.zoom - this.zoom
      this.zoom += differenceZoom / this.smoothingZoom

      if (differenceZoom) smoothing = 1

      var width = this.width / this.zoom
      var height = this.height / this.zoom

      var differenceX = this.followPos.x - (this.x + width/2)
      var differenceY = this.followPos.y - (this.y + height/2)

      this.x = this.x + differenceX / smoothing
      this.y = this.y + differenceY / smoothing

      if (this.x < 0) this.x = 0
      if (this.y < 0) this.y = 0

      if (this.x + width > cs.room.width)
         this.x = (cs.room.width - width) / (cs.room.width < width ? 2 : 1)

      if (this.y + height > cs.room.height)
         this.y = (cs.room.height - height) / (cs.room.height < height ? 2 : 1)
   },

   zoomOut: function() {
      if(this.config.zoom >= 2) this.config.zoom -= 1
   },

   zoomIn: function() {
      this.config.zoom += 1
   },

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
         x: this.x,
         y: this.y,
         width: this.width,
         height: this.height
      }
   },

   rectScaled: function() {
      return {
         x: Math.floor(this.x * this.scale),
         y: Math.floor(this.y * this.scale),
         width: this.width / this.zoom * this.scale,
         height: this.height / this.zoom * this.scale
      }
   }
}
