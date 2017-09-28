cs.objects['obj_crate'] = {
	create: function(){
		this.mask = cs.sprite.info({ spr: 'spr_crate' }).mask
		this.vspeed = 0;
		this.hspeed = 0;
		this.gravity = 8;
	},
	step: function(){
	    this.core.touch.check({ x:this.x, y:this.y, width:this.mask.width, height:this.mask.height });
	    if(this.core.touch.held){
			 console.log(this.core.touch.off_x)
	        this.x = this.core.touch.x-this.core.touch.offsetX;
	        this.y = this.core.touch.y-this.core.touch.offsetY;
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
