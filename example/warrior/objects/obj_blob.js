cs.objects['obj_blob'] = {
    create: function(){
        this.hspeed = 0;
        this.vspeed = 0;
        this.dir = -1;
        this.speed = 2;
        this.gravity = 2;
        this.width = 16;
        this.height = 16;
        this.jump = false;

    },
    step: function(){
        this.h_col = cs.script.collide(this, 'obj_block', {vspeed:0});
        pcol =  cs.script.collide(this, 'obj_player', {hspeed: 0});
        if(this.h_col || pcol || (this.x+this.hspeed) <= 0 || (this.x+this.hspeed) + this.width >= cs.room.width){
            this.hspeed = 0;
        }
        this.x += this.hspeed

        //Vertical Movement
        if(this.vspeed < this.gravity)
            this.vspeed += 1

        this.v_col = cs.script.collide(this, 'obj_block');
        if(this.v_col){
            this.vspeed = 0;
            if(this.jump && this.v_col.y > this.y){
                this.vspeed = -this.jump;
            }
        }
        this.y += this.vspeed;

        pcol = cs.script.collide(this, 'obj_player',{
            x: this.x-50,
            y: this.y-100,
            width: this.width+100,
            height: this.height+100
        });
        if(pcol){
            if(pcol.x > this.x){
                this.hspeed = 1;
                this.dir = -1;
            } else {
                this.hspeed = -1;
                this.dir = 1;
            }
        } else {
            this.hspeed = 0;
        }

        cs.draw.spriteExt('spr_blob', this.x+((this.dir < 0) ? this.width : 0), this.y, 0, this.dir);

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
