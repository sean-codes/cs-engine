cs.objects['obj_bird'] = {
   zIndex: 20,
   create: ({ object, cs }) => {
      object.sprite = 'bird'
      object.mask = cs.sprite.info({ spr: object.sprite }).mask
      object.x -= object.mask.width / 2
      object.timer = 1
      object.direction = .1
      object.vspeed = 0
      object.diving = 0
      object.soaring = 0
   },

   draw: ({ object, cs }) => {
      var angle = -30 * (object.vspeed / -5)
      if (object.vspeed > 0) {
         angle = 75 * (object.vspeed / 4)
      }

      var spr = (object.vspeed > 0) ? 'bird2' : 'bird'
      cs.draw.sprite({ spr: spr, x: object.x + object.mask.width / 2, y: object.y + object.mask.height / 2, angle: angle })

      cs.camera.follow({ x: object.x + object.mask.width / 2, y: object.y + object.mask.height / 2 })
      if (cs.save.state == 'PLAYING') {
         if (object.vspeed < 4)
            object.vspeed += 0.25
      } else {
         object.vspeed += object.direction
         if (Math.abs(object.vspeed) > 3) {
            object.direction = object.direction * -1
            object.vspeed += object.direction * 2
         }
      }
      object.y += object.vspeed

      if (cs.save.state == 'WRECKED') {
         cs.global.flap = false
         object.vspeed = 1.5
         return
      }
      //Check for touch
      if (cs.global.flap) {
         object.vspeed = -5
         cs.sound.play('flap')
         cs.global.flap = false
         if (object.diving > 24) {
            cs.global.score += 1
            cs.object.create({ type: 'obj_score_text', attr: { x: object.x, y: object.y } })
            cs.sound.play('score')
         }
         object.diving = 0
      }
      if (object.vspeed > 3)
         object.diving += 1

      //Building more pipes
      if (cs.save.state == 'PLAYING') {
         object.timer -= 1
         if (object.timer == 0) {
            object.timer = 120
            var space = 40
            var roomCenterVertical = cs.room.height / 2
            var randomY = roomCenterVertical - cs.math.iRandomRange(-80, 80)
            var down = cs.object.create({ type: 'obj_pipe', attr: { x: cs.room.width, y: randomY - space } })
            down.y -= down.mask.height
            down.pipe = 'down'
            var up = cs.object.create({ type: 'obj_pipe', attr: { x: cs.room.width, y: randomY + space } })

            cs.object.create({
               type: 'obj_score',
               attr: {
                  x: cs.room.width + down.mask.width,
                  y: randomY - space / 2
               }
            })
         }
      }

      //Colliding With Pipes
      if (cs.save.state == 'TAPTOFLAP') return
      var collisionScore = cs.scripts.collide(object, 'obj_score')
      var collisionPipe = cs.scripts.collide(object, 'obj_pipe')

      if (collisionPipe || object.y > cs.room.height + 50 || object.y < -50) {
         cs.save.state = 'WRECKED'
      }

      if (collisionScore) {
         cs.object.destroy(collisionScore)
         cs.global.score += 1
         cs.sound.play('score')
      }
   }
}
