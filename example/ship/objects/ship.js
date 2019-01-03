cs.objects.ship = {
   create: function(object) {
      this.sprite = 'ship'
      this.spriteInfo = cs.sprite.info({ spr: this.sprite })

      this.x = cs.room.width / 2
      this.y = cs.room.height - 20
      this.width = this.spriteInfo.width
      this.height = this.spriteInfo.height

      this.speed = 2

      this.timerFire = cs.timer.add({
         duration: 30,
         start: function() {
            cs.object.create({
               type: 'bullet',
               attr: { x: object.x + object.width/2, y: object.y }
            })
         }
      })
   },

   step: function() {
      // right
      if(cs.key.held(39)) {
         this.x += this.speed
      }

      //left
      if(cs.key.held(37)) {
         this.x -= this.speed
      }

      //spacebar
      if (cs.key.held(32)) {
         cs.timer.start(this.timerFire)
      }

      // prevent going off edges
      if(this.x < 0) this.x = 0
      if(this.x + this.width > cs.room.width) this.x = cs.room.width - this.width

      // camera follow
      cs.camera.follow({
         x: this.x + this.width/2,
         y: this.y + this.height/2
      })
   },

   draw: function() {
      cs.draw.sprite({
         spr: this.sprite,
         x: this.x,
         y: this.y,
      })
   }
}
