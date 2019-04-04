cs.objects.ship = {
   create: function(object) {


      this.x = cs.room.width / 2
      this.y = cs.room.height / 2
      this.width = 16
      this.height = 16

      this.xSpeed = 0
      this.ySpeed = 0
      this.turnSpeed = 0
      this.maxTurnSpeed = 15
      this.maxSpeed = 2
      this.direction = 0

      this.timerFire = cs.timer.create({
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
      this.forward = false

      // right
      var keys = {
         left: cs.key.held(39),
         right: cs.key.held(37),
         forward: cs.key.held(38)
      }

      if (keys.left || keys.right) {
         if (keys.left) {
            this.turnSpeed += 0.25
         }

         if (keys.right) {
            this.turnSpeed -= 0.25
         }
      } else {
         this.turnSpeed -= (this.turnSpeed/10)
      }

      if (keys.forward) {
         this.forward = true
         this.xSpeed += cs.math.cos(this.direction) * 0.25
         this.ySpeed += cs.math.sin(this.direction) * 0.25
         this.xSpeed = Math.min(Math.abs(this.xSpeed), this.maxSpeed) * Math.sign(this.xSpeed)
         this.ySpeed = Math.min(Math.abs(this.ySpeed), this.maxSpeed) * Math.sign(this.ySpeed)
      } else {
         this.xSpeed -= (this.xSpeed/30)
         this.ySpeed -= (this.ySpeed/30)
      }

      // move ship
      this.direction += Math.min(Math.abs(this.turnSpeed), this.maxTurnSpeed) * Math.sign(this.turnSpeed)
      this.x += this.xSpeed
      this.y += this.ySpeed


      //spacebar
      if (cs.key.held(32)) {
         cs.timer.start(this.timerFire)
      }

      // prevent going off edges
      if(this.x < 0) this.x = 0
      if(this.x > cs.room.width) this.x = cs.room.width
      if(this.y < 0) this.y = 0
      if(this.y > cs.room.height) this.y = cs.room.height

      // camera follow
      cs.camera.follow({
         x: this.x + this.width/2,
         y: this.y + this.height/2
      })
   },

   draw: function() {

      var burstDistance = Math.max(7, Math.random() * 10)
      var burstX = this.x - cs.math.cos(this.direction) * burstDistance
      var burstY = this.y - cs.math.sin(this.direction) * burstDistance
      if (this.forward) {
         cs.draw.sprite({
            spr: 'burst',
            x: burstX,
            y: burstY,
            angle: this.direction,
            center: true
         })
      }

      cs.draw.sprite({
         spr: 'ship',
         x: this.x,
         y: this.y,
         angle: this.direction,
         center: true
      })
   }
}
