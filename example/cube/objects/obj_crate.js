cs.objects['obj_crate'] = {

   create: ({ object, cs }) => {
      object.touch = cs.inputTouch.observer(true)
      object.mask = cs.sprite.info({ spr: 'spr_crate' }).mask
      object.vspeed = 0;
      object.hspeed = 0;
      object.gravity = 8;
   },

   draw: ({ object, cs }) => {
      object.touch.check({ x: object.x, y: object.y, width: object.mask.width, height: object.mask.height })

      if (object.touch.isHeld()) {
         object.x = object.touch.x - object.touch.offsetX;
         object.y = object.touch.y - object.touch.offsetY;
      } else {
         //Vertical Movement
         if (object.vspeed < object.gravity) {
            object.vspeed += 1;
         }

         object.v_col = cs.script.collide(object, 'obj_block')

         if (object.v_col) {
            object.vspeed = 0;
         }
         object.y += object.vspeed;
      }

      cs.draw.sprite({ spr: 'spr_crate', x: object.x, y: object.y });
   }
}
