cs.obj.load('obj_score', {
	create: function(){
		this.height = 40;
		this.width = 2;
		this.hspeed = 1;
	},
	step: function(){
		this.x -= this.hspeed;
	}
})

cs.obj.load('obj_score_text', {
	depth: -10,
	create: function(){
		this.text = cs.math.choose([
			'Nice dive!',
			'Daredevil!',
			'Dangerous!',
			'Holy Smokes!'
		]);
		this.timer = 60;
	},
	step: function(){
		this.y -= 1;
		this.x -= cs.global.speed;
		this.timer -= 1;

		cs.draw.setTextCenter();
		cs.draw.setColor('#FFFFFF');
		cs.draw.text(this.x, this.y, this.text);
		
		if(this.timer == 0){
			cs.obj.destroy(this);
		}
		if(cs.global.score > cs.save.topScore){
			cs.save.topScore = cs.global.score;
		}
	}
})