//---------------------------------------------------------------------------------------------//
//----------------------------------| Camera Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.camera = {
   scale: 1,
   x: 0,
   y: 0,
   followPos: { x: 0, y: 0 },
   width: 500,
   maxWidth: 500,
   height: 200,
   maxHeight: 400,
   smoothing: 1, // 1 means 1:1 movement

   setup: function(options) {
      this.width = options.width
      this.height = options.height
      this.maxWidth = options.maxWidth || this.width
      this.maxHeight = options.maxHeight || this.height
      this.smoothing = options.smoothing || this.smoothing

      cs.resize()
   },

   resize: function() {
      var w = cs.canvas.width
      var h = cs.canvas.height
      var ratioHeight = w / h //How many h = w
      var ratioWidth = h / w //how man w = a h

      var nw = cs.camera.maxWidth
      var nh = nw * ratioWidth
      if (nh >= cs.camera.maxHeight) {
         nh = cs.camera.maxHeight
         nw = nh * ratioHeight
      }

      this.width = nw
      this.height = nh
      this.scale = w / this.width
   },

   snap: function(pos) {
      this.follow(pos)
      this.update(1)
   },

   follow: function(pos) {
      this.followPos = { x: pos.x, y: pos.y }
   },

   update: function(smoothing) {
      smoothing = cs.default(smoothing, this.smoothing)

      var differenceX = this.followPos.x - (this.x + this.width / 2)
      var differenceY = this.followPos.y - (this.y + this.height / 2)

      this.x += (differenceX / smoothing)
      this.y += (differenceY / smoothing)

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
   }
}
