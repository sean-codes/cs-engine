cs.objects['box'] = {
   create: function() {
      // console.log('wtf')
      this.x = cs.default(this.x, 40)
      this.y = cs.default(this.y, 40)
      this.size = cs.default(this.size, 40)
      this.color = cs.default(this.color, '#f22')
      
      this.body = Matter.Bodies.rectangle(this.x + this.size/2, this.y + this.size/2, this.size, this.size)
      Matter.World.add(cs.global.matter.engine.world, [this.body])
   },

   draw: function() {
      cs.draw.setColor(this.color)
      cs.draw.shape({
         vertices: this.body.vertices,
         fill: true,
      })
   }
}
