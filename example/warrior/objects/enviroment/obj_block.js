cs.objects['obj_block'] = {
   create: ({ object, cs }) => {
      object.sprite = 'spr_block'
      object.mask = { x: 0, y: 0, width: 16, height: 16 }
   },

   draw: ({ object, cs }) => {
      cs.draw.sprite({ spr: object.sprite, x: object.x, y: object.y })
   }
}
