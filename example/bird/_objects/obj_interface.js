cs.obj.load('obj_interface', {
	create: function(){
		this.draw = 'gui';
		this.width = 30;
	    this.height = 30;
	},
	step: function(){
		var text = 'Score: ' + cs.global.score;
		var tw = cs.draw.textSize(text).width;
 		cs.draw.text(cs.camera.width - tw-10, this.y+5, 'Score: ' + cs.global.score);

 		if(cs.global.live === false){
 			var bw = 100; var bh = 50;
 			cs.draw.setAlpha(0.6);
 			cs.draw.rect(cs.camera.width/2 - bw/2, cs.camera.height/2 - bh/2, bw, bh, true);
 			cs.draw.setColor('#FFFFFF');
 			cs.draw.rect(cs.camera.width/2 - bw/2, cs.camera.height/2 - bh/2, bw, bh, false);
 			cs.draw.setColor('#FFFFFF');
 			cs.draw.setTextCenter();
 			cs.draw.text(cs.camera.width/2, cs.camera.height/2, 'Replay!');
 		}
	}
})