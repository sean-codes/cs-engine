cs.objects['obj_test'] = {
	create: function(){
		this.width = 16;
    	this.height = 16;

		this.myText = {
			text: 'some text cats meow fish',
			width: 50
		}
	},
	step: function(){
		var textInfo = cs.draw.textInfo(this.myText)
		cs.draw.text({ lines: textInfo.lines, x: 20, y:20 });
	}
}
