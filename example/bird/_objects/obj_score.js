cs.obj.load('obj_score', {
	create: function(){
		this.height = 40;
		this.width = 2;
		this.hspeed = 1;
	},
	step: function(){
		this.x -= this.hspeed;
	}
})