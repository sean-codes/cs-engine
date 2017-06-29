cs.objects['obj_player'] = {
   create: function(){
      this.hspeed = 0;
      this.vspeed = 0;
      this.dir = -1;
      this.speed = 2;
      this.gravity = 5;
      this.width = 8;
      this.height = 15;
      this.jump = 8;

      this.bounce = 0;
      this.bounceTimer = 20;

      this.attacking = 0;
      this.attackTimer = {
         load: 5,
         loadHold: 1,
         swing: 10,
         swingHold: 10,
         reload: 5
      }
      this.attackTotal = 0;
      for(var i in this.attackTimer)
         this.attackTotal += this.attackTimer[i]
    },
    step: function(){
       //Vertical Collisions
       var keys = {
          left: cs.key.held[37] || false,
          right: cs.key.held[39] || false,
          up: cs.key.held[38] || false,
          down: cs.key.held[40] || false,
          space: cs.key.held[32] || false
       }

       //Horizontal Movement
       if (keys.left){
          if(this.hspeed > -this.speed){this.dir = -1; this.hspeed -= 0.25}
       } else if (keys.right){
          if(this.hspeed < this.speed){this.dir = 1; this.hspeed += 0.25}
       } else {
          if(this.hspeed !== 0){
             var sign = cs.math.sign(this.hspeed);
             this.hspeed -= sign/4;
          }
       }

       this.h_col = cs.script.collide(this, 'obj_block', {vspeed: 0})
       if(this.h_col || (this.x+this.hspeed) <= 0 || (this.x+this.hspeed) + this.width >= cs.room.width){
          this.hspeed = 0;
       }
       this.x += this.hspeed;

        //Vertical Movement
        if(this.vspeed < this.gravity){
            this.vspeed += 1;
        }
        this.v_col = cs.script.collide(this, 'obj_block', {hspeed: 0})

        if(this.v_col)
           this.vspeed = 0;
        else
           this.y += this.vspeed;

        //Check if jumping
        if(keys.up && this.v_col && this.v_col.y > this.y)
           this.vspeed = -this.jump
        //Drawing
        this.bounceTimer -= 1;
        if(this.bounceTimer == 0){
            this.bounceTimer = 20;
            if(this.bounce >= 0){
                this.bounce = -1;
            } else {
                this.bounce = 1;
            }
            if(this.hspeed == 0){
                this.bounce = 0;
            }
        }

        //Attacking
        if(keys.space && this.attacking == 0)
            this.attacking = this.attackTotal

        var attackAngle = 0;
        var attackX = 0;
        var attackY = 0;
        var state = '';
        if(this.attacking > 0){
            this.attacking -= 1;
            var curAttack = this.attackTotal - this.attacking;
            var add = 0;
            for(state in this.attackTimer){
                if(curAttack >= add  && curAttack < add+this.attackTimer[state]){
                    var percent = (curAttack - add) / this.attackTimer[state];
                    switch(state){
                        case 'load':
                            attackAngle = percent * 45;
                            attackX = percent * 2;
                            break;
                        case 'loadHold':
                            attackAngle = 45;
                            attackX = 2;
                            break;
                        case 'swing':
                            attackAngle = 45 + percent * -135;
                            attackX = 2 - (percent*2);
                            break;
                        case 'swingHold':
                            attackAngle = -90;
                            attackX = 0;
                            break;
                        case 'reload':
                            attackAngle = -90 + (90*percent);
                            attackX = 0;
                            break;
                    }
                    break;
                }
                add += this.attackTimer[state];
            }
        }

        if(this.dir > 0){
           //Going Right
           cs.draw.sprite({ spr:'spr_sword', x:this.x+9+this.bounce-attackX, y:this.y+10, angle:-attackAngle })
           cs.draw.sprite({ spr:'spr_head', x:this.x, y:this.y })
           cs.draw.sprite({ spr:'spr_foot', x:this.x+1, y:this.y+13+this.bounce })
           cs.draw.sprite({ spr:'spr_foot', x:this.x+6, y:this.y+13-this.bounce })
           cs.draw.sprite({ spr:'spr_hand', x:this.x-1, y:this.y+9 })
           cs.draw.sprite({ spr:'spr_hand', x:this.x+7+this.bounce-attackX, y:this.y+9 })
           cs.draw.sprite({ spr:'spr_body', x:this.x+1, y:this.y+7 })
           cs.draw.sprite({ spr:'spr_shield', x:this.x-4-this.bounce, y:this.y+8})
        } else {
            //Going Left
            cs.draw.sprite({ spr:'spr_sword', x:this.x-1-this.bounce+attackX, y:this.y+10, angle:attackAngle })
            cs.draw.sprite({ spr:'spr_head', x:this.x+9, y:this.y, scaleX:-1 })
            cs.draw.sprite({ spr:'spr_foot', x:this.x+1, y:this.y+13+this.bounce })
            cs.draw.sprite({ spr:'spr_foot', x:this.x+6, y:this.y+13-this.bounce })
            cs.draw.sprite({ spr:'spr_hand', x:this.x-1-this.bounce+attackX, y:this.y+9 })
            cs.draw.sprite({ spr:'spr_hand', x:this.x+7-this.bounce, y:this.y+9 })
            cs.draw.sprite({ spr:'spr_body', x:this.x+1, y:this.y+7 })
            cs.draw.sprite({ spr:'spr_shield', x:this.x+4+this.bounce, y:this.y+8 })
        }

        //Camera
        cs.camera.follow(this);
        if(cs.key.down[33]){ cs.camera.zoomIn(); }
        if(cs.key.down[34]){ cs.camera.zoomOut(); }
    }
}
