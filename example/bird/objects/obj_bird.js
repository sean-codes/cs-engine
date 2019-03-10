cs.objects['obj_bird'] = {
   zIndex: 20,
   create: function() {
      this.sprite = 'bird'
      this.mask = cs.sprite.info({ spr: this.sprite }).mask
      this.x -= this.mask.width / 2
      this.timer = 60
      this.direction = .1
      this.vspeed = 0
      this.diving = 0
      this.soaring = 0
   },
   step: function() {
      var angle = -30 * (this.vspeed / -5)
      if (this.vspeed > 0) {
         angle = 75 * (this.vspeed / 4)
      }

      var spr = (this.vspeed > 0) ? 'bird2' : 'bird'
      cs.draw.sprite({ spr: spr, x: this.x + this.mask.width / 2, y: this.y + this.mask.height / 2, angle: angle })

      cs.camera.follow({ x: this.x + this.mask.width / 2, y: this.y + this.mask.height / 2 })
      if (cs.save.state == 'PLAYING') {
         if (this.vspeed < 4)
            this.vspeed += 0.25
      } else {
         this.vspeed += this.direction
         if (Math.abs(this.vspeed) > 3) {
            this.direction = this.direction * -1
            this.vspeed += this.direction * 2
         }
      }
      this.y += this.vspeed

      if (cs.save.state == 'WRECKED') {
         cs.global.flap = false
         this.vspeed = 1.5
         return
      }
      //Check for touch
      if (cs.global.flap) {
         this.vspeed = -5
         cs.sound.play('flap')
         cs.global.flap = false
         if (this.diving > 24) {
            cs.global.score += 1
            cs.object.create({ type: 'obj_score_text', attr: { x: this.x, y: this.y } })
            cs.sound.play('score')
         }
         this.diving = 0
      }
      if (this.vspeed > 3)
         this.diving += 1

      //Building more pipes
      if (cs.save.state == 'PLAYING') {
         this.timer -= 1
         if (this.timer == 0) {
            this.timer = 120
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
      var collisionScore = cs.script.collide(this, 'obj_score')
      var collisionPipe = cs.script.collide(this, 'obj_pipe')

      if (collisionPipe || this.y > cs.room.height + 50 || this.y < -50) {
         cs.save.state = 'WRECKED'
      }

      if (collisionScore) {
         cs.object.destroy(collisionScore)
         cs.global.score += 1
         cs.sound.play('score')
      }
   }
}
