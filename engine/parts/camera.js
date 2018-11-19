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

      this.resize()
      //cs.surface.resize();
   },
   resize: function() {
      var viewSize = cs.canvas.getBoundingClientRect()

      var w = viewSize.width
      var h = viewSize.height
      var ratioHeight = w / h //How many h = w
      var ratioWidth = h / w //how man w = a h

      var nw = cs.camera.maxWidth - (cs.camera.maxWidth % ratioWidth);
      var nh = nw * ratioWidth;
      if (nh >= cs.camera.maxHeight) {
         nh = cs.camera.maxHeight - (cs.camera.maxHeight % ratioHeight);
         nw = nh * ratioHeight;
      }

      this.width = Math.ceil(nw)
      this.height = Math.ceil(nh)
      this.scale = w / nw
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
      if(smoothing == 0) console.log('wtf')
      var differenceX = this.followPos.x - (this.x + this.width / 2)
      var differenceY = this.followPos.y - (this.y + this.height / 2)

      this.x += Math.floor(differenceX / smoothing)
      this.y += Math.floor(differenceY / smoothing)

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
      if (rect.x + rect.width < this.x || rect.x > this.x + this.width ||
         rect.y + rect.height < this.y || rect.y > this.y + this.height) {
         return true;
      }
      return false
   }
}
