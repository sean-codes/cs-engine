cs.objects['obj_blob'] = {
   create: function(){
      this.hspeed = 0;
      this.vspeed = 0;
      this.speed = 2;
      this.gravity = 2;
      this.width = 16;
      this.height = 16;
      this.jump = false;
      this.hit = {
         trigger: false,
         timer: 0,
         timerLength: 0
      }
   },
   step: function(){
      pcol = cs.script.collide(this, 'obj_player',{
         x: this.x-50,
         y: this.y-100,
         width: this.width+100,
         height: this.height+100
      })

      this.h_col = cs.script.collide(this, 'obj_block', {vspeed:0})
      if(this.h_col || (this.x+this.hspeed) <= 0 || (this.x+this.hspeed) + this.width >= cs.room.width){
         this.hspeed = 0;
      }
      this.x += this.hspeed

      //Player collision move in that direction
      //going to trade this for some math. Old gen sean don't be mad
      if(pcol){
         if(Math.abs(this.hspeed) < 1)
            this.hspeed += Math.sign(pcol.x - this.x) * 0.1
      } else {
         this.hspeed = 0;
      }


      //Vertical Movement
      if(this.vspeed < this.gravity)
         this.vspeed += 1

      this.v_col = cs.script.collide(this, 'obj_block');
      if(this.v_col){
         this.vspeed = 0;
         if(this.jump && this.v_col.y > this.y)
            this.vspeed = -this.jump;
      }
      this.y += this.vspeed;





      //Draw the Sprite draw less opacity is just took damage
      if(this.hit.toggle){
         this.hit.timer += 1
         this.hit.toggle = this.hit.timer !== this.hit.timerLength
         cs.draw.setAlpha(this.hit.timer / this.hit.timerLength)
      }
      cs.draw.spriteExt('spr_blob', this.x+((this.hspeed >= 0) ? this.width : 0), this.y, 0, Math.sign(this.hspeed)*-1);

      //draw healthbar
      cs.script.fillBar({
         x: this.x + this.width/2 - 16,
         y: this.y - 10,
         color: '#465',
         width:32,
         height: 6,
         percent: 0.6
      })
   }
}
