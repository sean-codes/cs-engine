cs.objects['obj_crate'] = {
	create: function(){
	   this.width = 32;
	   this.height = 48;
		this.vspeed = 0;
		this.hspeed = 0;
		this.gravity = 8;
	},
	step: function(){
	    this.core.touch.check({ x:this.x, y:this.y, width:this.width, height:this.height });
	    if(this.core.touch.held){
	        this.x = this.core.touch.x-this.core.touch.off_x;
	        this.y = this.core.touch.y-this.core.touch.off_y;
		} else {
			//Vertical Movement
			if(this.vspeed < this.gravity){
				this.vspeed += 1;
			}

			this.v_col = cs.script.collide(this, 'obj_block')

			if(this.v_col){
				this.vspeed = 0;
			}
			this.y += this.vspeed;
		}
		cs.draw.sprite({ spr:'spr_crate', x:this.x, y:this.y });
	}
}
