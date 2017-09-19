cs.objects['obj_interface'] = {
	zIndex: 30,
	create: function(){
		this.width = 30;
	   this.height = 30;
	   this.backgroundPlaying = undefined;
		this.core.surface = 'gui'
		cs.sound.toggleMute(true)
	},
	step: function(){
        //Handling Touch
        this.core.touch.check({ x:0, y:0, width:cs.draw.canvas.width, height:cs.draw.canvas.height})
        //Sound
        if(this.core.touch.down && this.core.touch.within({ x:0, y:0, width:14*3, height: 14*3})){
            cs.sound.toggleMute(!cs.sound.mute)
            return;
        }
        var soundSprite = 'sound_on';
        if(cs.sound.mute)
            soundSprite = 'sound_off';
				cs.draw.sprite({
					spr: soundSprite,
					x: 0, y: 0,
					scale: 3 })

		  var btnHeightMax = 200;
		  var btnHeightMin = 50;
		  var btnSpace = 20;
		  var bw = 300;
		  var bx = cs.draw.canvas.width/2-bw/2

        switch(cs.save.state){
            case 'START':
					cs.script.interface.drawButtons(['Please tap to start'])
               if(this.core.touch.down)
                  cs.save.state = 'TAPTOFLAP';
               break;
            case 'TAPTOFLAP':
               if(!this.backgroundPlaying)
            		this.backgroundPlaying = cs.sound.play('background', { loop: true });
					cs.script.interface.drawButtons(['Tap to flap!', 'Your Best Score: ' + cs.save.topScore])
                if(this.core.touch.down){
                    cs.save.state = 'PLAYING'
                    cs.global.flap = true
                }
                break;

            case 'PLAYING':
					var text = 'Score: ' + cs.global.score;
					cs.draw.setFont("20px Arial")
					var tw = cs.draw.textWidth(text);
					cs.draw.setAlpha(0.5);
					var rect = { x: cs.draw.canvas.width-tw-20, y: 0, width:tw+20, height:60 }
					cs.draw.fillRect(rect);
					cs.draw.setColor('#FFFFFF');
					cs.draw.strokeRect(rect);
					cs.draw.setColor('#FFFFFF');
					cs.draw.setFont("20px Arial")
					cs.draw.setTextAlign('end')
					cs.draw.text({
						x: cs.draw.canvas.width -10,
						y: 5,
						text: text
					})
					cs.draw.setColor('#FFFFFF');
					cs.draw.setFont("20px Arial")
					cs.draw.setTextAlign('end')
					cs.draw.text({
						x: cs.draw.canvas.width -10,
						y: 30,
						text: 'Best: ' + cs.save.topScore
					})
					if(this.core.touch.down)
					  	cs.global.flap = true;
					break;

            case 'WRECKED':
				   cs.script.interface.drawButtons(['Replay!', 'Your Best Score: ' + cs.save.topScore])
               if(cs.global.score > cs.save.topScore)
        				cs.save.topScore = cs.global.score;

               if(this.core.touch.down){
                    cs.save.state = 'TAPTOFLAP';
                    cs.room.restart();
               }
               break;
        }
    }
}
