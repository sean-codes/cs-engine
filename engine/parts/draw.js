//---------------------------------------------------------------------------------------------//
//----------------------------------| Drawing Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.draw = {
   ctx : undefined,
   canvas : { width: 0, height: 0 },
   alpha : 1,
   raw : false,
   height : 0,
   width : 0,
   fontSize : 12,
   background: '#465',
   debug: {},
   w : 0,
   h : 0,
   o : 0,
   debugReset: function(){
      this.debug = {
         skippedSprites: 0,
         drawnSprites: 0
      }
   },
   sprite : function(options){
      sprite = cs.sprite.list[options.spr]
      var info = cs.sprite.info(options)

      if(!this.raw && !this.skip){
         //If outside camera skip
         if(options.x+sprite.fwidth < cs.camera.x || options.x  > cs.camera.x+cs.camera.width
         || options.y+sprite.fheight < cs.camera.y || options.y  > cs.camera.y+cs.camera.height ){
            this.debug.skippedSprites += 1
            return
         }
      }
      this.debug.drawnSprites += 1

      this.ctx.save();
      this.ctx.translate(Math.floor(options.x), Math.floor(options.y))
      this.ctx.rotate(options.angle * Math.PI/180)
      this.ctx.scale(info.scaleX+0.001, info.scaleY+0.001)
      this.ctx.drawImage(sprite.frames[info.frame], -sprite.xoff, -sprite.yoff)
      this.ctx.restore()

      cs.draw.reset()
   },
   text: function(options){
      this.ctx.fillText(options.text, options.x, options.y);
      cs.draw.reset()
   },
   textSize: function(str){
      return this.ctx.measureText(str)
   },
   line: function(options){
      var cx = 0 - ((this.ctx.lineWidth % 2 == 0) ? 0 : 0.50)
      var cy = 0 - ((this.ctx.lineWidth % 2 == 0) ? 0 : 0.50)

      this.ctx.beginPath();
      this.ctx.moveTo(options.x1-cx,options.y1-cy);
      this.ctx.lineTo(options.x2-cx,options.y2-cy);
      this.ctx.stroke();
      cs.draw.reset();
   },
   fillRect: function(args){
      if(typeof args.width == 'undefined') args.width = args.size || 0
      if(typeof args.height == 'undefined') args.height = args.size || 0

      this.ctx.fillRect(args.x,args.y,args.width,args.height);
      cs.draw.reset();
   },
   strokeRect: function(args){
      var lineWidth = this.ctx.lineWidth
      var lineWidthAdjust = lineWidth/2
      var rect = {
         x: args.x + lineWidthAdjust,
         y: args.y + lineWidthAdjust,
         width: (args.width ? args.width : args.size) - lineWidth,
         height: (args.height ? args.height : args.size) - lineWidth
      }
      this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
      cs.draw.reset();
   },
   circle : function(x, y, rad, fill){
      if(typeof fill == 'undefined') fill = true
      cs.draw.ctx.beginPath();
      cs.draw.ctx.arc(x, y, rad, 0, Math.PI*2, true);
      cs.draw.ctx.closePath();
      (fill)
          ? cs.draw.ctx.fill()
          : cs.draw.ctx.stroke()
      cs.draw.reset();
   },
   circleGradient : function(x, y, radius, c1, c2){
      //Draw a circle
      var g = this.ctx.createRadialGradient(x, y, 0, x, y, radius)
      g.addColorStop(1, c2)
      g.addColorStop(0, c1)
      this.ctx.fillStyle = g
      this.ctx.beginPath()
      this.ctx.arc(x, y, radius, 0, Math.PI*2, true)
      this.ctx.closePath()
      //Fill
      this.ctx.fill()
      cs.draw.reset()
   },
   fixPosition: function(args){
      x = Math.floor(args.x); y = Math.floor(args.y);
      width = Math.floor(args.width);
      height = Math.floor(args.height);

      return { x:x, y:y, width:width, height:height }
   },
   setColor: function(color){
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = color;
   },
   setAlpha : function(alpha){
      this.ctx.globalAlpha = alpha;
   },
   setWidth : function(width){
      this.ctx.lineWidth = width;
   },
   setFont : function(font){
      this.ctx.font = font;
   },
   setTextAlign : function(alignment){
      this.ctx.textAlign = alignment;
   },
   setTextBaseline : function(alignment){
      this.ctx.textBaseline=alignment;
   },
   setTextCenter : function(){
      this.setTextAlign('center');
      this.setTextBaseline('middle');
   },
   setOperation : function(operation){
      this.ctx.globalCompositeOperation = operation;
   },
   setSurface : function(name){
      this.surface = cs.surface.list[name]
      this.canvas = this.surface.canvas
      this.ctx = this.surface.ctx
      this.raw = this.surface.raw
      this.skip = this.surface.skip
   },
   reset : function(){
      cs.draw.setAlpha(1);
      cs.draw.setWidth(1);
      cs.draw.setFont(this.fontSize + "px Arial");
      cs.draw.setTextAlign('start');
      cs.draw.setTextBaseline('top');
      cs.draw.setColor("#000");
      cs.draw.setOperation('source-over');
   }
}
