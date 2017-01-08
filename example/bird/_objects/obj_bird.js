cs.obj.load('obj_bird', {
	create: function(){
		this.width = 16;
		this.height = 14;
		this.hspeed = 0;
		this.timer = 120;
	},
	step: function(){
		if(this.hspeed < 4){
			this.hspeed += 0.25;
		}
		if(this.y + this.height + this.hspeed < cs.room.height)
			this.y += this.hspeed;


		//Check for touch
		this.touch.check(0, 0, cs.room.width, cs.room.height);
		if(this.touch.down){
			this.hspeed = -5;
		}

		cs.draw.sprite('bird', this.x, this.y);
		cs.camera.follow(this);

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
		var collisionPipe = this.meet('obj_pipe', this.x, this.y, this.width, this.height);
		if(collisionPipe !== -1){
			console.log('die');
		}
	}
})