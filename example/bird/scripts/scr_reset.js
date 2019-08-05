cs.scripts.reset = function() {
   cs.object.reset()
   // globals
   cs.global = {
      live: true,
      score: 0,
      flap: false,
      start: false,
      speed: 1
   }

   var bird = cs.object.create({
      type: 'obj_bird',
      attr: {
         x: (cs.room.width / 2),
         y: cs.room.height / 2
      }
   })

   cs.object.create({ type: 'obj_interface' })
   cs.object.create({ type: 'obj_background' })

   cs.camera.snap({
      x: bird.x + bird.mask.width / 2,
      y: bird.y + bird.mask.height / 2
   })
}
