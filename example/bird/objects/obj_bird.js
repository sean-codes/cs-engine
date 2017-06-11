cs.objects['obj_bird'] = {
	depth: 5,
	create: function(){
		cs.script.setSprite(this, 'bird');
		this.timer = 60;
		this.direction = .1;
		this.vspeed = 0;
		this.diving = 0;
		this.soaring = 0;
		this.particle.settings = JSON.parse(`{
				"shape": "square",
				"colorStart": "#ffffff",
				"colorEnd": "#ffffff",
				"size": 4,
				"grow": -4,
				"alpha": 20,
				"fade": 10,
				"speedMin": 25,
				"speedMax": 40,
				"dirMin": 120,
				"dirMax": 120,
				"wobbleX": 0,
				"wobbleY": 0,
				"lifeMin": 5,
				"lifeMax": 15,
				"accel": 0,
				"gravity": 0,
				"particlesPerStep": 15
		}`);
	},
	step: function(){
		var angle = -30 * (this.vspeed/-5);
		if(this.vspeed > 0){
			angle = 75 * (this.vspeed/4);
		}
		cs.particle.step();
		if(this.vspeed > 0)
			cs.draw.spriteExt('bird2', this.x, this.y, angle);
		else
			cs.draw.spriteExt('bird', this.x, this.y, angle);

		cs.camera.follow(this);
        if(cs.save.state == 'PLAYING'){
			if(this.vspeed < 4)
				this.vspeed += 0.25;
		} else {
            this.vspeed += this.direction;
			if(Math.abs(this.vspeed) > 3){
				this.direction = this.direction * -1;
				this.vspeed += this.direction*2;
			}
        }
		this.y += this.vspeed;

        if(cs.save.state == 'WRECKED'){
            cs.global.flap = false;
            this.vspeed = 1.5;
            return;
        }
		//Check for touch
		if(cs.global.flap){
			this.vspeed = -5;
			cs.sound.play('flap');
			cs.global.flap = false;
			if(this.diving > 24){
				cs.global.score += 1;
				cs.obj.create('obj_score_text', this.x, this.y);
				cs.particle.burst(this.x, this.y, this.width, 0, 10);
				cs.sound.play('score');
			}
			this.diving = 0;
		}
		if(this.vspeed > 3)
			this.diving += 1;

		//Building more pipes
		if(cs.save.state == 'PLAYING'){
			this.timer -= 1;
			if(this.timer == 0){
				this.timer = 120;
				var space = 40;
				var roomCenterVertical = cs.room.height/2;
				var randomY = roomCenterVertical - cs.math.iRandomRange(-80, 80);
				var down = cs.obj.create('obj_pipe', cs.room.width, randomY-space);
				down.y -= down.height; down.pipe = 'down';
				var up = cs.obj.create('obj_pipe', cs.room.width, randomY+space);
				cs.obj.create('obj_score', cs.room.width+down.width, randomY - space/2);
			}
		}

     //Colliding With Pipes
     if(cs.save.state == 'TAPTOFLAP') return;
		var collisionScore = cs.script.collide(this, 'obj_score');
		var collisionPipe = cs.script.collide(this, 'obj_pipe');
		if(collisionPipe || this.y > cs.room.height+50 || this.y < -50){
			cs.save.state = 'WRECKED';
		}
		if(collisionScore){
			cs.obj.destroy(collisionScore);
			cs.global.score += 1;
			cs.sound.play('score');
		}
	}
}
