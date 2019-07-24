cs.objects['obj_block'] = {
   create: ({ object, cs }) => {
      object.mask = cs.sprite.info({ spr: 'spr_block' }).mask
   },

   draw: ({ object, cs }) => {
      cs.draw.sprite({ spr: 'spr_block', x: object.x, y: object.y });
   }
}
