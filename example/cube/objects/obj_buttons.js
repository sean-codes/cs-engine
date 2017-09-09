cs.objects['obj_buttons'] = {
	create: function(){
		this.width = 30;
	   this.height = 30;
	   this.surface = 'gui';
		this.cx = 0;
		this.cy = 0;
	},
	step: function(){
		var btnRect = {
			x:cs.draw.canvas.width - 50,
			y:cs.draw.canvas.height - 50,
			width:this.width,
			height:this.height
		}

		this.core.touch.check(btnRect);
		if(this.core.touch.down){
			//console.log('open');
			cs.key.virtualPress(38);
		}

		var text = cs.input.return(this.id);
		if(text !== ''){
			console.log('Button 1 Says: ' + text);
		}

		if(this.core.touch.held){
			cs.draw.setAlpha(0.5);
		}
		cs.draw.fillRect(btnRect)
		cs.draw.setColor("white")
		cs.draw.strokeRect(btnRect)
	}
}
