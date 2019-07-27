cs.objects['obj_background'] = {
   create: ({ object, cs }) => {
      object.timer = 0
   },

   draw: ({ object, cs }) => {
      object.timer -= 1
      if (object.timer == -1) {
         for (var i = 0; i < 10; i++) {
            cs.object.create({
               type: 'obj_bgPart',
               attr: {
                  x: cs.room.width * (i / 10),
                  y: 0
               }
            })
         }
         object.timer = 0
      }

      if (object.timer == 0) {
         cs.object.create({ type: 'obj_bgPart', attr: { x: cs.room.width, y: 0 } })
         object.timer = cs.math.iRandomRange(40, 120)
      }
   }
}

cs.objects['obj_bgPart'] = {
   zIndex: 10,
   create: ({ object, cs }) => {
      object.timer = 600
      object.bgType = cs.math.choose(['mountain', 'cloud'])

      object.sprite = cs.math.choose([
         'cloud1',
         'cloud2',
         'cloud3'
      ])
      object.mask = cs.sprite.info({ spr: object.sprite }).mask
      //Cloud
      object.y = cs.math.iRandomRange(0, cs.room.height - object.mask.height * 2)
      object.hspeed = cs.global.speed + Math.random() * 1.5
      //Mountain
      if (object.bgType == 'mountain') {
         object.sprite = cs.math.choose([
            'mountain1',
            'mountain2'
         ])
         object.mask = cs.sprite.info({ spr: object.sprite }).mask
         object.hspeed = cs.global.speed
         object.y = cs.room.height - object.mask.height + 1
      }
   },

   draw: ({ object, cs }) => {
      if (cs.save.state !== 'WRECKED' || object.bgType == 'cloud')
         object.x -= object.hspeed

      if (object.x < -object.mask.width) {
         cs.object.destroy(object)
      }

      cs.draw.sprite({ spr: object.sprite, x: object.x, y: object.y })
   }
}
