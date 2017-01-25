cs.obj.load('obj_interface', {
	create: function(){
		this.draw = 'gui';
		this.width = 30;
	    this.height = 30;
	    this.backgroundPlaying = undefined;
        this.drawButton = function(by, text){
            var bw = 135;
            var bh = 60;
            var bx = cs.camera.width/2 - bw/2;

            cs.draw.setAlpha(0.6);
            cs.draw.rect(bx, by, bw, bh, true);
            cs.draw.rect(bx, by, bw, bh, false);

            cs.draw.setColor('#FFFFFF');
            cs.draw.setTextCenter();
            cs.draw.text(cs.camera.width/2, by+bh/2, text);
        }
	},
	step: function(){
        //Handling Touch
        this.touch.check(0, 0, cs.camera.width, cs.camera.height);
        //Sound
        if(this.touch.down && this.touch.x > 0 && this.touch.x < 14 && this.touch.y > 0 && this.touch.y < 14){
            console.log('Toggline Mute from obj_interface');
            if(cs.sound.mute === false)
                cs.sound.toggleMute(true);
            else
                cs.sound.toggleMute(false);
            return;
        }
        var soundSprite = 'sound_on';
        if(cs.sound.mute)
            soundSprite = 'sound_off';
        cs.draw.sprite(soundSprite, 0, 0);
        switch(cs.save.state){
            case 'START':
                this.drawButton(cs.camera.height/2-45, 'Please tap to start');
                if(this.touch.down)
                    cs.save.state = 'TAPTOFLAP';
                break;

            case 'TAPTOFLAP':
                if(!this.backgroundPlaying)
                    this.backgroundPlaying = cs.sound.play('background', { loop: true });
                this.drawButton(cs.camera.height/2-70, 'Tap to flap!');
                this.drawButton(cs.camera.height/2, 'Your Best Score: ' + cs.save.topScore);
                if(this.touch.down){
                    cs.save.state = 'PLAYING';
                    cs.global.flap = true;
                }
                break;

            case 'PLAYING':
                var text = 'Score: ' + cs.global.score;
                var tw = cs.draw.textSize(text).width;
                cs.draw.setAlpha(0.5);
                cs.draw.rect(cs.camera.width-65, 0, 64, 40, true);
                cs.draw.rect(cs.camera.width-65, 0, 64, 40);
                cs.draw.setColor('#FFFFFF');
                cs.draw.text(cs.camera.width - tw-10, this.y+5, 'Score: ' + cs.global.score);
                cs.draw.setColor('#FFFFFF');
                cs.draw.text(cs.camera.width - tw-10, this.y+20, 'Best: ' + cs.save.topScore);
                if(this.touch.down)
                    cs.global.flap = true;
                break;

            case 'WRECKED':
                this.drawButton(cs.camera.height/2-70, 'Replay!');
                this.drawButton(cs.camera.height/2, 'Your Best Score: ' + cs.save.topScore);
                if(cs.global.score > cs.save.topScore)
        			cs.save.topScore = cs.global.score;

                if(this.touch.down){
                    cs.save.state = 'TAPTOFLAP';
                    cs.room.restart();
                }
                break;
        }
    }
});
