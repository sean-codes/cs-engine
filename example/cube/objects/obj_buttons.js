cs.objects['obj_buttons'] = {
	create: function(){
		this.width = 30;
	    this.height = 30;
	    this.draw = 'gui';
		this.cx = 0;
		this.cy = 0;
	},
	step: function(){
		this.cx = cs.draw.gui[0].canvas.width - 50;
		this.cy = cs.draw.gui[0].canvas.height - 50;
		this.touch.check(this.cx, this.cy, this.width, this.height);
		if(this.touch.down){
			//console.log('open');
			cs.key.virtualPress(38);
		}

		var text = cs.input.return(this.id);
		if(text !== ''){
			console.log('Button 1 Says: ' + text);
		}

		if(this.touch.held){
			cs.draw.setAlpha(0.5);
		}
		cs.draw.rect(this.cx, this.cy, this.width, this.height, true);
		cs.draw.setColor("white");
		cs.draw.rect(this.cx, this.cy, this.width, this.height, false);
	}
}
