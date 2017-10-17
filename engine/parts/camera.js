//---------------------------------------------------------------------------------------------//
//----------------------------------| Camera Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.camera = {
   scale : 1,
   x : 0,
   y : 0,
   followPos: { x: 0, y: 0, width: 0, height: 0 },
   width : 500, maxWidth : 500,
   height : 200, maxHeight : 400,
   setup: function(options){
      this.width = options.width;
      this.height = options.height;
      this.maxWidth = options.maxWidth || this.width;
      this.maxHeight = options.maxHeight || this.height;
      cs.surface.resize();
   },
   follow : function(obj){
      this.followPos = { x: obj.x, y: obj.y, width: obj.mask.width, height: obj.mask.height }
   },
   update: function(){
      this.x = (this.followPos.x+this.followPos.width/2)-this.width/2
      this.y = (this.followPos.y+this.followPos.height/2)-this.height/2

      if(this.x < 0) this.x = 0
      if(this.y < 0) this.y = 0

      if(this.x+this.width > cs.room.width)
         this.x = (cs.room.width - this.width) / (cs.room.width < this.width ? 2 : 1)

      if(this.y + this.height > cs.room.height)
         this.y = (cs.room.height - this.height) / (cs.room.height < this.height ? 2 : 1)
   },
   zoomOut : function(){},
   zoomIn : function(){},
   outside: function(rect){
      if(rect.x+rect.width < this.x || rect.x > this.x+this.width ||
         rect.y+rect.height < this.y || rect.y > this.y+this.height ){
            return true;
      }
      return false
   }
}
