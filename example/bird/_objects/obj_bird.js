cs.obj.load('obj_bird', {
	depth: -5,
	create: function(){
		this.setSprite('bird');
		this.timer = 60;
		this.direction = .1;
		this.vspeed = 0;
	},
	step: function(){
		var angle = -30 * (this.vspeed/-5);
		if(this.vspeed > 0){
			angle = 75 * (this.vspeed/4);
		}
		if(this.vspeed > 0)
			cs.draw.spriteExt('bird2', this.x, this.y, angle);
		else
			cs.draw.spriteExt('bird', this.x, this.y, angle);

		cs.camera.follow(this);
		if(cs.global.live == false) return;

		
		

		if(cs.global.start == false){
			this.vspeed += this.direction;
			if(Math.abs(this.vspeed) > 3){
				this.direction = this.direction * -1;
				this.vspeed += this.direction*2;
			}
		} else {
			if(this.vspeed < 4)
				this.vspeed += 0.25;
		}
		this.y += this.vspeed;


		//Check for touch
		if(cs.global.flap){
			this.vspeed = -5;
			cs.global.start = true;
			cs.global.flap = false;
		}

		//Building more pipes
		if(cs.global.start){
			this.timer -= 1;
			if(this.timer == 0){
				this.timer = 120;
				var space = 40;
				var roomCenterVertical = cs.room.height/2;
				var randomY = roomCenterVertical - cs.math.iRandomRange(-80, 80);
				var down = cs.obj.create('obj_pipe', cs.room.width, randomY-space);
				down.y -= down.height; down.pipe = 'down';
				var up = cs.obj.create('obj_pipe', cs.room.width, randomY+space);
				cs.obj.create('obj_score', cs.room.width, randomY - space/2);
			}
		}
		var collisionScore = this.meet('obj_score');
		var collisionPipe = this.meet('obj_pipe');
		if(collisionPipe || this.y > cs.room.height+50 || this.y < -50){
			cs.global.live = false;
		}
		if(collisionScore){
			cs.obj.destroy(collisionScore);
			cs.global.score += 1;
		}
	}
})