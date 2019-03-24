cs.objects.ground = {
   create: function() {
      this.body = Matter.Bodies.rectangle(cs.room.width/2, cs.room.height - 20, cs.room.width, 40, { isStatic: true });
      Matter.World.add(cs.global.matter.engine.world, [this.body])
   },

   draw: function() {
      cs.draw.setColor('#495')
      cs.draw.shape({
         vertices: this.body.vertices,
         fill: true
      })
   }
}
