//---------------------------------------------------------------------------------------------//
//-----------------------------------| Room Functions |----------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.room = {
   width: 100,
   height: 100,
   rect: { x: 0, y: 0, width: 100, height: 100 },

   setup: function(info) {
      this.width = info.width
      this.height = info.height
      if (info.background) cs.canvas.style.background = info.background
      this.rect = { x: 0, y: 0, width: this.width, height: this.height }
      cs.resize()
   },

   outside: function(rect) {
      var width = cs.default(rect.width, 0)
      var height = cs.default(rect.height, 0)

      return (rect.x < 0 || rect.x + width > this.width ||
         rect.y < 0 || rect.y + height > this.height)
   }
}
