/* global cs, Matter */

cs.objects.box = {
   create: ({ object, cs, attr }) => {
      object.x = cs.default(attr.x, 40)
      object.y = cs.default(attr.y, 40)
      object.size = cs.default(attr.size, 40)
      object.color = cs.default(attr.color, '#f22')


      object.body = Matter.Bodies.rectangle(
         object.x + object.size / 2,
         object.y + object.size / 2,
         object.size,
         object.size,
      )

      Matter.World.add(cs.global.matter.engine.world, [object.body])
   },

   draw: ({ object, cs }) => {
      cs.draw.setColor(object.color)
      cs.draw.shape({
         vertices: object.body.vertices,
         fill: true,
      })
   },
}
