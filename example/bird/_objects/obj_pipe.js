cs.obj.load('obj_pipe', {
	create: function(){
		this.width = 24;
		this.height = 256;
		this.life = 600;
		this.pipe = 'up';
	},
	step: function(){
		cs.draw.sprite('pipe_'+this.pipe, this.x, this.y);
		if(cs.global.live == false) return;

		this.hspeed = 1;
		this.x -= this.hspeed;

		this.life -= 1;
		if(this.life == 0)
			cs.obj.destroy(this.id);
	}
})