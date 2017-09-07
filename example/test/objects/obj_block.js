cs.objects['obj_block'] = {
	create: function(){
		this.width = 16;
    	this.height = 16;
	},
	step: function(){
		cs.draw.sprite({ spr:'spr_block', x: 20, y:20 });
	}
}
