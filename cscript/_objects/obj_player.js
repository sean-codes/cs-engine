cs.obj.load('obj_player', function(){
    //-------------------------------------------------------------------------------------------//
    //-----------------------------------| Create Event |----------------------------------------//
    //-------------------------------------------------------------------------------------------//
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
	//Lightign
	//cs.script.lightAdd(this.id, 100, 8, 8);
}, function(){
    //-------------------------------------------------------------------------------------------//
    //-----------------------------------| Step Event |------------------------------------------//
    //-------------------------------------------------------------------------------------------//
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
	this.h_col = cs.pos.meet('obj_block', this.x+this.hspeed, this.y, this.x+this.width+this.hspeed, this.y+this.height);
	if(this.h_col > 0 || (this.x+this.hspeed) <= 0 || (this.x+this.hspeed) + this.width >= cs.room.width){
		this.hspeed = 0;
	}
	this.x += this.hspeed;
	
	//Vertical Movement
	if(this.vspeed < this.gravity){
		this.vspeed += 1;
	}
	this.v_col = cs.pos.meet('obj_block', this.x, this.y+this.vspeed, this.x+this.width, this.y+this.height+this.vspeed);
	if(this.v_col > 0){
		this.vspeed = 0;
		if(keys.up && cs.obj.list[this.v_col].y > this.y){
			this.vspeed = -this.jump;
		}
	}
	this.y += this.vspeed;
	
    cs.camera.follow(this);
	if(cs.key.down[33]){ cs.camera.zoomIn(); }
	if(cs.key.down[34]){ cs.camera.zoomOut(); }

	cs.draw.sprite('spr_player', this.dir, this.x, this.y);

	//Networking!
	var network = cs.global.networkControl;
	network.x = this.x; network.y = this.y;
	if(!cs.script.compareObj(keys, this.old_keys)){
		this.old_keys = keys;
		cs.script.networkSendMovement(this);
	}
});
