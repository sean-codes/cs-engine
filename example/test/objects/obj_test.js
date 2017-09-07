cs.objects['obj_test'] = {
	create: function(){
		this.width = 16;
    	this.height = 16;
		this.text = cs.text.create({
			text: 'some text',
			lineHeight: 10,
			width: 50
		})
	},
	step: function(){
		cs.draw.sprite({ spr:'spr_block', x: 20, y:20 });
	}
}
