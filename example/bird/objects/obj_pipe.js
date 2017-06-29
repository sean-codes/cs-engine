cs.objects['obj_pipe'] = {
	zIndex: 8,
	create: function(){
		this.width = 24;
		this.height = 256;
		this.pipe = 'up';
		this.hspeed = cs.global.speed;
	},
	step: function(){
		cs.draw.sprite({ spr:'pipe_'+this.pipe, x:this.x, y:this.y});
		if(cs.save.state == 'WRECKED') return;

		this.x -= this.hspeed;

		if(this.x < -this.width){
			cs.obj.destroy(this);
		}
	}
}
