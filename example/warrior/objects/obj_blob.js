cs.obj.load('obj_blob',{
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
        this.h_col = this.meet('obj_block', {vspeed:0});
        pcol =  this.meet('obj_player', {hspeed: 0});
        if(this.h_col || pcol || (this.x+this.hspeed) <= 0 || (this.x+this.hspeed) + this.width >= cs.room.width){
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
            if(this.jump && this.v_col.y > this.y){
                this.vspeed = -this.jump;
            }
        }
        this.y += this.vspeed;

        pcol = this.meet('obj_player',{
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

        //cs.draw.sprite('blob', this.x, this.y, 0);
        cs.draw.spriteExt('blob', this.x+((this.dir < 0) ? this.width : 0), this.y, 0, this.dir);
    }
})
