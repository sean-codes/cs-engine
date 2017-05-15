cs.objects['obj_player'] = {
	create: function(){
	    this.core = true;
		this.width = 16;
		this.height = 16;
		this.gravity = 7;
		this.vspeed = 0;
		this.hspeed = 0;
		this.jump = 10;
		this.speed = 4;
		this.dir = 0;
		this.v_col = -1;
		this.h_col = -1;
		this.touch = cs.touch.create();
		this.old_keys = {
			left: false,
			right: false,
			up: false,
			down: false
		}
		//Lighting
		//cs.script.lightAdd(this.id, 100, 8, 8);
	},
	step: function(){
	    var keys = {
	    	left: cs.key.held[37] || false,
	    	right: cs.key.held[39] || false,
	    	up: cs.key.held[38] || false,
	    	down: cs.key.held[40] || false
	    }

		//Horizontal Movement
		if (keys.left){
			if(this.hspeed > -this.speed){this.dir = 1; this.hspeed -= 0.25}
		} else if (keys.right){
			if(this.hspeed < this.speed){this.dir = 0; this.hspeed += 0.25}
		} else {
			if(this.hspeed !== 0){
				var sign = cs.math.sign(this.hspeed);
				this.hspeed -= sign/4;
			}
		}

		this.h_col = cs.script.collide(this, 'obj_block', {vspeed:0})
		if(this.h_col || (this.x+this.hspeed) <= 0 || (this.x+this.hspeed) + this.width >= cs.room.width){
			this.hspeed = 0;
		}
		this.x += this.hspeed;

		//Vertical Movement
		if(this.vspeed < this.gravity){
			this.vspeed += 1;
		}
		this.v_col = cs.script.collide(this, 'obj_block')
		if(this.v_col){
			this.vspeed = 0;
			if(keys.up && this.v_col.y > this.y){
				this.vspeed = -this.jump;
			}
		}
		this.y += this.vspeed;

	    cs.camera.follow(this);
		if(cs.key.down[33]){ cs.camera.zoomIn(); }
		if(cs.key.down[34]){ cs.camera.zoomOut(); }

		cs.draw.sprite('spr_player', this.x, this.y, this.dir);

		//Networking!
		var network = cs.global.networkControl;
		network.x = this.x; network.y = this.y;
		if(!cs.script.compareObj(keys, this.old_keys)){
			this.old_keys = keys;
			cs.script.networkSendMovement(this);
		}
	}
}
