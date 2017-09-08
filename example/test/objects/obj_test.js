cs.objects['obj_test'] = {
	create: function(){
		this.width = 16;
    	this.height = 16;

		this.myText = {
			text: 'some text cats meow fish',
			lineHeight: 10,
			width: 50
		}
	},
	step: function(){
		var textInfo = cs.draw.textInfo(this.myText)
		cs.draw.text({ lines: textInfo.lines, lineHeight: textInfo.lineHeight, x: 20, y:20 });
	}
}
