/* global cs, Matter */

cs.objects.circle = {
   create: ({ object, cs, attr }) => {
      // console.log('wtf')
      object.x = cs.default(attr.x, 40)
      object.y = cs.default(attr.y, 40)
      object.radius = cs.default(attr.radius, 40)
      object.color = cs.default(attr.color, '#f22')

      object.body = Matter.Bodies.circle(
         object.x + object.radius / 2,
         object.y + object.radius / 2,
         object.radius,
      )

      Matter.World.add(cs.global.matter.engine.world, [object.body])
   },

   draw: ({ object, cs }) => {
      cs.draw.setColor(object.color)
      cs.draw.shape({
         vertices: object.body.vertices,
         fill: false,
      })
   },
}
