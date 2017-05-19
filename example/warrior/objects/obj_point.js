cs.objects['obj_point'] = {
   create: function(){
      this.vspeed = 0
      this.hspeed = 0
      this.width = 4
      this.height = 4
      this.timer = 20

      this.particle.settings = {
      	"shape": "square",
      	"colorStart": "#0099ff",
      	"colorEnd": "#0099ff",
      	"size": 4,
      	"grow": -5,
      	"alpha": 100,
      	"fade": 10,
      	"speedMin": 35,
      	"speedMax": 15,
      	"dirMin": 231,
      	"dirMax": 296,
      	"wobbleX": 0,
      	"wobbleY": 0,
      	"lifeMin": 10,
      	"lifeMax": 20,
      	"accel": 0,
      	"gravity": 0,
      	"particlesPerStep": 10
      }
   },
   step: function(){
      if(this.timer == 20){
         cs.draw.setColor('rgba(0, 100, 255, 0.5)')
         cs.draw.rect(this.x, this.y, 4, 4, true)
         cs.draw.rect(this.x, this.y, 4, 4, false)

         //Going to skip efficiency for a moment
         var hcol = cs.script.collide(this, 'obj_block', {vspeed: 0})
         var vcol = cs.script.collide(this, 'obj_block', {hspeed: 0})

         if(hcol) this.hspeed *= -0.5
         if(vcol) this.vspeed *= -0.5; else this.vspeed += 1

         this.x += this.hspeed
         this.y += this.vspeed

         var pcol = cs.script.collide(this, 'obj_player', {hspeed: 0})
         if(pcol){
             cs.particle.burst(this.x, this.y, 16, 16, 10);
             this.timer -= 1
          }
      } else {
         this.timer -= 1
         cs.particle.step();
         if(this.timer == 0)
            cs.obj.destroy(this)
      }
   }
}
