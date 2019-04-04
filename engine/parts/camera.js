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
      var smoothing = cs.default(smoothing, this.smoothing)

      // smooth zooming
      var differenceZoom = this.config.zoom - this.zoom
      this.zoom += differenceZoom / this.smoothingZoom
      // if zooming turn smoothing off
      if (differenceZoom) smoothing = 1

      var scale = this.info().scale
      // var scale = Math.round(this.scale * this.zoom * 1000) / 1000
      this.width = cs.canvas.width / scale
      this.height = cs.canvas.height / scale

      var differenceX = this.followPos.x - (this.x + this.width/2)
      var differenceY = this.followPos.y - (this.y + this.height/2)

      this.x = this.x + differenceX / smoothing
      this.y = this.y + differenceY / smoothing

      if (this.x < 0) this.x = 0
      if (this.y < 0) this.y = 0

      if (this.x + this.width > cs.room.width) {
         this.x = (cs.room.width - this.width) / (cs.room.width < this.width ? 2 : 1)
      }

      if (this.y + this.height > cs.room.height) {
         this.y = (cs.room.height - this.height) / (cs.room.height < this.height ? 2 : 1)
      }
   },

   zoomOut: function() {
      if(this.config.zoom >= 2) this.config.zoom -= 1
   },

   zoomIn: function() {
      this.config.zoom += 1
   },

   outside: function(rect) {
      if (
            rect.x + rect.width < this.x
         || rect.x > this.x + this.width
         || rect.y + rect.height < this.y
         || rect.y > this.y + this.height
      ) {
         return true
      }
      return false
   },

   info: function() {
      return {
         zoom: Math.round(this.zoom * 1000) / 1000,
         scale: Math.round(this.scale * 1000) / 1000,
         x: Math.round(this.x * 10) / 10 + 0.005, // prevent 0.5 artifacts
         y: Math.round(this.y * 10) / 10 + 0.005,
         width: Math.round(this.width * 10) / 10,
         height: Math.round(this.height * 10) / 10
      }
   },
}
