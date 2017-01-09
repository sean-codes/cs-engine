cs.obj.load('obj_bird', {
	create: function(){
		this.setSprite('bird');
		this.hspeed = 0;
		this.timer = 60;
	},
	step: function(){
		var angle = -30 * (this.hspeed/-5);
		if(this.hspeed > 0){
			angle = 75 * (this.hspeed/4);
		}
		if(this.hspeed > 0)
			cs.draw.spriteExt('bird2', this.x, this.y, angle);
		else
			cs.draw.spriteExt('bird', this.x, this.y, angle);

		cs.camera.follow(this);
		if(cs.global.live == false) return;

		if(this.hspeed < 4)
			this.hspeed += 0.25;
		
		this.y += this.hspeed;


		//Check for touch
		this.touch.check(0, 0, cs.room.width, cs.room.height);
		if(this.touch.down){
			this.hspeed = -5;
		}

		//Building more pipes
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