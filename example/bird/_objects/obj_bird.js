cs.obj.load('obj_bird', {
	create: function(){
		this.width = 16;
		this.height = 14;
	},
	step: function(){
		cs.draw.sprite('bird', this.x, this.y);
	}
})