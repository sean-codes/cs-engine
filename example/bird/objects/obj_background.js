cs.objects['obj_background'] = {
	create: function(){
		this.timer = 0;
	},
	step: function(){
		this.timer -= 1;
		if(this.timer == -1){
			for(var i = 0; i < 10; i++){
				cs.obj.create('obj_bgPart', cs.math.iRandomRange(0, cs.room.width), 0);
			}
			this.timer = 0;
		}
		if(this.timer == 0){
			cs.obj.create('obj_bgPart', cs.room.width, 0);
			this.timer = cs.math.iRandomRange(40, 120);
		}
	}
}

cs.objects['obj_bgPart'] = {
	create: function(){
		this.timer = 600;
		this.bgType = cs.math.choose(['mountain', 'cloud']);

		this.setSprite(cs.math.choose([
			'cloud1',
			'cloud2',
			'cloud3'
		]));

		//Cloud
		this.y = cs.math.iRandomRange(0, cs.room.height-this.height*2);
		this.hspeed = cs.global.speed+cs.math.choose([0, 1]);
		//Mountain
		if(this.bgType == 'mountain'){
			this.setSprite(cs.math.choose([
				'mountain1',
				'mountain2'
			]));
			this.hspeed = cs.global.speed;
			this.y = cs.room.height-this.height;
		}
	},
	step: function(){
		if(cs.save.state !== 'WRECKED' || this.bgType == 'cloud')
			this.x -= this.hspeed;

		if(this.x < -this.width){
			cs.obj.destroy(this);
		}

		cs.draw.sprite(this.sprite, this.x, this.y);
	}
}
