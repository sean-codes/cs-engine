cs.objects['obj_background'] = {
   create: function() {
      this.timer = 0
   },
   step: function() {
      this.timer -= 1
      if (this.timer == -1) {
         for (var i = 0; i < 10; i++) {
            cs.object.create({
               type: 'obj_bgPart',
               attr: {
                  x: cs.room.width * (i / 10),
                  y: 0
               }
            })
         }
         this.timer = 0
      }

      if (this.timer == 0) {
         cs.object.create({ type: 'obj_bgPart', attr: { x: cs.room.width, y: 0 } })
         this.timer = cs.math.iRandomRange(40, 120)
      }
   }
}

cs.objects['obj_bgPart'] = {
   zIndex: 10,
   create: function() {
      this.timer = 600
      this.bgType = cs.math.choose(['mountain', 'cloud'])

      this.sprite = cs.math.choose([
         'cloud1',
         'cloud2',
         'cloud3'
      ])
      this.mask = cs.sprite.info({ spr: this.sprite }).mask
      //Cloud
      this.y = cs.math.iRandomRange(0, cs.room.height - this.mask.height * 2)
      this.hspeed = cs.global.speed + Math.random() * 1.5
      //Mountain
      if (this.bgType == 'mountain') {
         this.sprite = cs.math.choose([
            'mountain1',
            'mountain2'
         ])
         this.mask = cs.sprite.info({ spr: this.sprite }).mask
         this.hspeed = cs.global.speed
         this.y = cs.room.height - this.mask.height + 1
      }
   },
   step: function() {
      if (cs.save.state !== 'WRECKED' || this.bgType == 'cloud')
         this.x -= this.hspeed

      if (this.x < -this.mask.width) {
         cs.object.destroy(this)
      }

      cs.draw.sprite({ spr: this.sprite, x: this.x, y: this.y })
   }
}
