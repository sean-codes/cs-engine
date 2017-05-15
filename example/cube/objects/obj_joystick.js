cs.objects['obj_joystick'] = {
    create: function(){
        this.width = 64;
        this.height = 64;
        this.draw = 'gui';
    	this.tx = 0;
    	this.ty = 0;
    	this.jw = this.width/2;
    	this.jh = this.height/2;
    	cs.global.showJoyStick = true;
    },
    step: function(){
    	if(!cs.global.showJoyStick)
            return

        this.x = 10; this.y = cs.draw.height - this.height - 10;

        this.touch.check(this.x, this.y, this.width, this.height);

        this.tx = this.x + (this.width/2) - (this.jw/2);
        this.ty = this.y + (this.width/2) - (this.jh/2);
        if(this.touch.held){
            this.tx = this.touch.x-(this.jw/2);
            if(this.tx < this.x){
                this.tx = this.x;
                //left key
                cs.key.virtualDown(37);
            } else {cs.key.virtualUp(37)}
            if(this.tx + this.jw > this.x + this.width){
                this.tx = this.x+this.width-this.jw;
                //right key
                cs.key.virtualDown(39);
            } else {cs.key.virtualUp(39)}
            this.ty = this.touch.y-(this.jh/2);
            if(this.ty < this.y){
                this.ty = this.y;
                //up key
                cs.key.virtualDown(38);
            } else {cs.key.virtualUp(38);}
            if(this.ty + this.jw > this.y + this.height){
                this.ty = this.y+this.height-this.jh;
            }
        } else {
    		if(this.touch.up){
    			if(cs.key.held[37]){
    				cs.key.virtualUp(37);
    			}
    			if(cs.key.held[38]){
    				cs.key.virtualUp(38);
    			}
    			if(cs.key.held[39]){
    				cs.key.virtualUp(39);
    			}
    		}
        }

    	cs.draw.setAlpha(0.25);
        cs.draw.rect(this.x, this.y, this.width, this.height, true);
        cs.draw.setColor('#fff');
        cs.draw.rect(this.tx, this.ty, this.jw, this.jh, false);

    	cs.draw.text(1, 0, 'FPS Step: ' + cs.fps.rate);
    	cs.draw.text(1, 30, 'Scale: ' + cs.camera.scale);
    }
}
