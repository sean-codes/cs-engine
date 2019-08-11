cs.objects['obj_pipe'] = {
   zIndex: 15,
   create: ({ object, cs, attr }) => {
      object.mask = { x: 0, y: 0, width: 24, height: 256 }
      object.x = attr.x
      object.y = attr.y
      object.pipe = 'up'
      object.hspeed = cs.global.speed
   },

   draw: ({ object, cs }) => {
      cs.draw.sprite({ spr: 'pipe_' + object.pipe, x: object.x, y: object.y })
      if (cs.save.state == 'WRECKED') return

      object.x -= object.hspeed

      if (object.x < -object.mask.width) {
         cs.object.destroy(object)
      }
   }
}
