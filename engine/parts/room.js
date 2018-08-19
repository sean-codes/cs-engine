//---------------------------------------------------------------------------------------------//
//-----------------------------------| Room Functions |----------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.room = {
   width : 100,
   height : 100,
   restart: function(){
      this.restarting = true
   },
   reset: function(){
      cs.obj.list = []
      cs.global = {}
      cs.start()
      cs.sound.reset()
      this.restarting = false
   },
   setup: function(info){
      this.width = info.width
      this.height = info.height
      cs.draw.background = info.background || '#000'
      this.rect = { x: 0, y: 0, width: this.width, height: this.height }
      cs.surface.resize()
   },
   outside(rect){
      if(typeof rect.width == 'undefined') rect.width = 0
      if(typeof rect.height == 'undefined') rect.height = 0

      return (rect.x < 0 || rect.x + rect.width > this.width
           || rect.y < 0 || rect.y + rect.height > this.height)
   }
}
