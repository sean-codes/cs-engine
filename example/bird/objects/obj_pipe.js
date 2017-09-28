cs.objects['obj_pipe'] = {
	zIndex: 15,
	create: function(){
		this.mask = { x: 0, y: 0, width: 24, height: 256 }
		this.pipe = 'up';
		this.hspeed = cs.global.speed;
	},
	step: function(){
		cs.draw.sprite({ spr:'pipe_'+this.pipe, x:this.x, y:this.y});
		if(cs.save.state == 'WRECKED') return;

		this.x -= this.hspeed;

		if(this.x < -this.mask.width){
			cs.obj.destroy(this);
		}
	}
}
