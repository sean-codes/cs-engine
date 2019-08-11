cs.objects.ground = {
   create: ({ object, cs, attr }) => {
      object.body = Matter.Bodies.rectangle(cs.room.width/2, cs.room.height - 20, cs.room.width, 40, { isStatic: true });
      Matter.World.add(cs.global.matter.engine.world, [object.body])
   },

   draw: ({ object, cs }) => {
      cs.draw.setColor('#495')
      cs.draw.shape({
         vertices: object.body.vertices,
         fill: true
      })
   }
}
