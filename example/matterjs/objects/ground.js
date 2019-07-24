cs.objects.ground = {
   create: ({ object, cs }) => {
      this.body = Matter.Bodies.rectangle(cs.room.width/2, cs.room.height - 20, cs.room.width, 40, { isStatic: true });
      Matter.World.add(cs.global.matter.engine.world, [this.body])
   },

   draw: ({ object, cs }) => {
      cs.draw.setColor('#495')
      cs.draw.shape({
         vertices: this.body.vertices,
         fill: true
      })
   }
}
