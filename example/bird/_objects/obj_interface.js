cs.obj.load('obj_interface', {
	create: function(){
		this.draw = 'gui';
		this.width = 30;
	    this.height = 30;
	    this.backgroundPlaying = undefined;
	},
	step: function(){
        if(!this.backgroundPlaying)
            this.backgroundPlaying = cs.sound.play('background');
            
		var text = 'Score: ' + cs.global.score;
		var tw = cs.draw.textSize(text).width;
		cs.draw.setColor('#FFFFFF');
 		cs.draw.text(cs.camera.width - tw-10, this.y+5, 'Score: ' + cs.global.score);

 		//Handling touch
 		this.touch.check(0, 0, cs.camera.width, cs.camera.height);
		if(this.touch.down){
			cs.global.flap = true;
			if(cs.global.live === false){
				cs.room.restart();
			}
			if(cs.global.live === true){
				cs.global.start = true;
			}
		}

 		if(cs.global.start == false || cs.global.live == false){
 			//Replay
 			var bw = 125; var bh = 50;
 			var bx = cs.camera.width/2 - bw/2;
 			var by = cs.camera.height/2 - bh/2;
 			cs.draw.setAlpha(0.6);
 			cs.draw.rect(bx, by, bw, bh, true);
 			cs.draw.setColor('#FFFFFF');
 			cs.draw.rect(bx, by, bw, bh, false);
 			cs.draw.setColor('#FFFFFF');
 			cs.draw.setTextCenter();
 			var text = !cs.global.start ? 'Tap to Flap!' : 'Replay!';
 			cs.draw.text(cs.camera.width/2, cs.camera.height/2, text);


 			//Best Score
 			by += 60;
 			cs.draw.setAlpha(0.6);
 			cs.draw.rect(bx, by, bw, bh, true);
 			cs.draw.setColor('#FFFFFF');
 			cs.draw.rect(bx, by, bw, bh, false);
 			cs.draw.setColor('#FFFFFF');
 			cs.draw.setTextCenter();
 			var text = 'Your Best Score: ' + cs.save.topScore;
 			cs.draw.text(cs.camera.width/2, by+bh/2, text);

 		}
	}
})
