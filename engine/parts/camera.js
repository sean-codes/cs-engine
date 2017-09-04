//---------------------------------------------------------------------------------------------//
//----------------------------------| Camera Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.camera = {
   scale : 1,
   x : 0,
   y : 0,
   followX: 0,
   followY: 0,
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
      this.followX = obj.x
      this.followY = obj.y
      this.followWidth = obj.width
      this.followHeight = obj.height
   },
   update: function(){
      this.x = (this.followX+this.followWidth/2)-this.width/2
      this.y = (this.followY+this.followHeight/2)-this.height/2

      console.log(this.y)
      if(this.x < 0) this.x = 0
      if(this.y < 0) this.y = 0

      if(this.x+this.width > cs.room.width)
         this.x = (cs.room.width - this.width) / (cs.room.width < this.width ? 2 : 1)

      if(this.y + this.height > cs.room.height)
         this.y = (cs.room.height - this.height) / (cs.room.height < this.height ? 2 : 1)
   },
   zoomOut : function(){},
   zoomIn : function(){}
}
