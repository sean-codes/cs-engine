/* global cs */

cs.objects.obj_block = {
   create: ({ object, attr }) => {
      object.sprite = 'spr_block'
      object.mask = { x: 0, y: 0, width: 16, height: 16 }
      object.x = attr.x
      object.y = attr.y
   },

   draw: ({ object, cs }) => {
      cs.draw.sprite({ spr: object.sprite, x: object.x, y: object.y })
   },
}
