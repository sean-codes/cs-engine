cs.objects['box'] = {
   create: ({ object, cs }) => {
      // console.log('wtf')
      this.x = cs.default(object.x, 40)
      object.y = cs.default(object.y, 40)
      object.size = cs.default(object.size, 40)
      object.color = cs.default(object.color, '#f22')

      object.body = Matter.Bodies.rectangle(object.x + object.size/2, object.y + object.size/2, object.size, object.size)
      Matter.World.add(cs.global.matter.engine.world, [object.body])
   },

   draw: ({ object, cs }) => {
      cs.draw.setColor(object.color)
      cs.draw.shape({
         vertices: object.body.vertices,
         fill: true,
      })
   }
}
