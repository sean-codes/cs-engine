cs.objects['obj_buttons'] = {
	create: function(){
		this.width = 30;
	   this.height = 30;
	   this.surface = 'gui';
		this.cx = 0;
		this.cy = 0;
		this.touch = cs.touch.observer()
	},
	step: function(){
		var btnRect = {
			x:cs.draw.canvas.width - 50,
			y:cs.draw.canvas.height - 50,
			width:this.width,
			height:this.height
		}

		this.touch.check(btnRect);
		if(this.touch.isDown()){
			//console.log('open');
			cs.key.virtualPress(38);
		}

		//var text = cs.input.return(this.id);
		text = ''
		if(text !== ''){
			console.log('Button 1 Says: ' + text);
		}

		if(this.touch.isHeld()){
			cs.draw.setAlpha(0.5);
		}
		cs.draw.fillRect(btnRect)
		cs.draw.setColor("white")
		cs.draw.strokeRect(btnRect)
	}
}
