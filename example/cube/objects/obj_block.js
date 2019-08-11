cs.objects['obj_block'] = {
   create: ({ object, cs, attr }) => {
      object.mask = cs.sprite.info({ spr: 'spr_block' }).mask
      object.x = attr.x
      object.y = attr.y
   },

   draw: ({ object, cs }) => {
      cs.draw.sprite({ spr: 'spr_block', x: object.x, y: object.y });
   }
}
