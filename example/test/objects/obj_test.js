cs.objects['obj_test'] = {
	create: function(){
		this.width = 16;
    	this.height = 16;
		this.text = cs.text.create({
			name: 'test',
			text: 'some text cats meow fish',
			lineHeight: 10,
			width: 50
		})
	},
	step: function(){
		cs.draw.text({ test: true, text:'test', x: 20, y:20 });
	}
}
