cs.objects['circle'] = {
   create: ({ object, cs }) => {
      // console.log('wtf')
      this.x = cs.default(this.x, 40)
      this.y = cs.default(this.y, 40)
      this.radius = cs.default(this.radius, 40)
      this.color = cs.default(this.color, '#f22')

      this.body = Matter.Bodies.circle(this.x + this.radius/2, this.y + this.radius/2, this.radius)
      Matter.World.add(cs.global.matter.engine.world, [this.body])
   },

   draw: ({ object, cs }) => {
      cs.draw.setColor(this.color)
      cs.draw.shape({
         vertices: this.body.vertices,
         fill: false,
      })
   }
}
