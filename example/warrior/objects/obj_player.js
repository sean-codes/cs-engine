cs.objects['obj_player'] = {
    create: function(){
        this.hspeed = 0;
        this.vspeed = 0;
        this.dir = -1;
        this.speed = 2;
        this.gravity = 2;
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
        for(var i in this.attackTimer){
            this.attackTotal += this.attackTimer[i];
        }
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
        //this.h_col = this.meet('obj_block', {vspeed:0});
        this.h_col = cs.script.collide(this, 'obj_block', {vspeed: 0})
        if(this.h_col || (this.x+this.hspeed) <= 0 || (this.x+this.hspeed) + this.width >= cs.room.width){
            this.hspeed = 0;
        }
        this.x += this.hspeed;

        //Vertical Movement
        if(this.vspeed < this.gravity){
            this.vspeed += 1;
        }
        this.v_col = this.meet('obj_block');
        if(this.v_col){
            this.vspeed = 0;
            if(keys.up && this.v_col.y > this.y){
                this.vspeed = -this.jump;
            }
        }
        this.y += this.vspeed;

        //Drawing
        //Handle Legs
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
        if(keys.space && this.attacking == 0){
            this.attacking = this.attackTotal;
        }

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

        //Weapon Hit
        if(state == 'swing'){
           cs.script.player.attack()
        }

        //Going Left
        if(this.dir == -1){
            cs.draw.spriteExt('spr_sword', this.x-1-this.bounce+attackX, this.y+10, attackAngle);
            cs.draw.sprite('spr_head', this.x, this.y);
            cs.draw.sprite('spr_foot', this.x+1, this.y+13+this.bounce);
            cs.draw.sprite('spr_foot', this.x+6, this.y+13-this.bounce);
            cs.draw.sprite('spr_hand', this.x-1-this.bounce+attackX, this.y+9);
            cs.draw.sprite('spr_hand', this.x+7-this.bounce, this.y+9);
            cs.draw.sprite('spr_body', this.x+1, this.y+7);
            cs.draw.sprite('spr_shield', this.x+4+this.bounce, this.y+8);
        } else {
            //Going Right
            cs.draw.spriteExt('spr_sword', this.x+9+this.bounce-attackX, this.y+10, -attackAngle);
            cs.draw.spriteExt('spr_head', this.x+9, this.y, 0, -1, 1);
            cs.draw.sprite('spr_foot', this.x+1, this.y+13+this.bounce);
            cs.draw.sprite('spr_foot', this.x+6, this.y+13-this.bounce);
            cs.draw.sprite('spr_hand', this.x-1, this.y+9);
            cs.draw.sprite('spr_hand', this.x+7+this.bounce-attackX, this.y+9);
            cs.draw.sprite('spr_body', this.x+1, this.y+7);
            cs.draw.sprite('spr_shield', this.x-4-this.bounce, this.y+8);
        }



        //Camera
        cs.camera.follow(this);
        if(cs.key.down[33]){ cs.camera.zoomIn(); }
        if(cs.key.down[34]){ cs.camera.zoomOut(); }
    }
}
