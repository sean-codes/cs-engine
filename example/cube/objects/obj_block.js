cs.objects['obj_block'] = {
	create: function(){
		this.mask = cs.sprite.info({ spr: 'spr_block' }).mask
	},
	step: function(){
		cs.draw.sprite({ spr:'spr_block', x:this.x, y:this.y });
	}
}
