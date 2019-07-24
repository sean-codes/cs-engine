cs.objects['obj_blob'] = {
   zIndex: 1,
   create: ({ object, cs }) => {
      object.sprite = 'spr_blob'
      object.mask = cs.sprite.info({ spr: object.sprite }).mask
      object.hspeed = 0
      object.vspeed = 0
      object.speed = 2
      object.gravity = 2
      object.dir = 1
      object.jump = false
      object.health = {
         value: 10,
         max: 10
      }
      object.hit = {
         timer: 0,
         timerLength: 0
      }
   },
   
   draw: ({ object, cs }) => {
      //Horizontal Movement
      pcol = cs.script.collide.rect('obj_player', {
         x: object.x - 50,
         y: object.y - 100,
         width: object.mask.width + 100,
         height: object.mask.height + 100
      })

      //This is going to be a little weird but trust me! :]
      if (pcol && (pcol.x > object.x + object.mask.width || pcol.x + pcol.mask.width < object.x)) {
         if (pcol.x > object.x) {
            if (object.hspeed < 1)
               object.hspeed += 0.1
            object.dir = 1
         } else {
            if (object.hspeed > -1) { object.hspeed -= 0.1 }
            object.dir = -1
         }
      } else {
         //Slowing down
         object.hspeed -= (object.hspeed * 0.5)
      }

      object.h_col = cs.script.collide.obj(object, 'obj_block')
      if (object.h_col || (object.x + object.hspeed) <= 0 || (object.x + object.hspeed) + object.mask.width >= cs.room.width)
         object.hspeed = 0;

      object.x += object.hspeed

      //Vertical Movement
      if (object.vspeed < object.gravity)
         object.vspeed += 1

      object.y += object.vspeed
      object.v_col = cs.script.collide.obj(object, 'obj_block')

      if (object.v_col) {
         object.y -= object.vspeed
         object.vspeed = 0
      }

      //Draw the Sprite draw less opacity is just took damage
      if (object.hit.timer > 0)
         cs.draw.setAlpha(0.25 + (1 - object.hit.timer / object.hit.timerLength))

      cs.draw.sprite({
         spr: 'spr_blob',
         x: object.x + ((object.dir < 0) ? object.mask.width : 0),
         y: object.y,
         scaleX: object.dir
      })
   }
}
