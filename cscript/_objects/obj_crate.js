cs.obj.load('obj_crate', function(){
    //-------------------------------------------------------------------------------------------//
    //-------------------------------------| Create |--------------------------------------------//
    //-------------------------------------------------------------------------------------------//
    this.width = 32;
    this.height = 48;
	this.vspeed = 0;
	this.gravity = 8;
}, function(){
    //-------------------------------------------------------------------------------------------//
    //--------------------------------------| Step |---------------------------------------------//
    //-------------------------------------------------------------------------------------------//
    this.touch.check(this.x, this.y, this.width, this.height);
    if(this.touch.held){
        this.x = this.touch.x-this.touch.off_x;
        this.y = this.touch.y-this.touch.off_y;
	} else {
		//Vertical Movement
		if(this.vspeed < this.gravity){
			this.vspeed += 1;
		}
		this.v_col = cs.pos.meet('obj_block', this.x, this.y+this.vspeed, this.x+this.width, this.y+this.height+this.vspeed);
		if(this.v_col > 0){
			this.vspeed = 0;
		}
		this.y += this.vspeed;
	}
	cs.draw.sprite('spr_crate', 0, this.x, this.y);
});