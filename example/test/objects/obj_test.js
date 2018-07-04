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
		//var textInfo = cs.draw.textInfo(this.myText)
		var draws = 2000;
		cs.draw.text({ lines: [cs.fps.rate, 'draws: ' + draws], x: 20, y:20 });
		var i = draws; while(i--) cs.draw.sprite({ spr: 'spr_test', x: 50, y: 50, scaleX: -1 })
	}
}
