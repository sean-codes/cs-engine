cs.obj.load('obj_otherplayer', function(){
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
	this.socketID = -1,
	this.keys = {
		left: false,
		right: false,
		up: false,
		down: false
	}
}, function(){
    //-------------------------------------------------------------------------------------------//
    //-----------------------------------| Step Event |------------------------------------------//
    //-------------------------------------------------------------------------------------------//

	//Horizontal Movement
	if (this.keys.left){
		if(this.hspeed > -this.speed){this.dir = 1; this.hspeed -= 0.25}
	} else if (this.keys.right){
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
		if(this.keys.up && cs.obj.list[this.v_col].y > this.y){
			this.vspeed = -this.jump;
		}
	}
	this.y += this.vspeed;

	cs.draw.sprite('spr_player', this.dir, this.x, this.y);
});
