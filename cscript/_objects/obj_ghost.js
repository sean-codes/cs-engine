obj_ghost = new Object();

obj_ghost.width = 16;
obj_ghost.height = 16;
obj_ghost.gravity = 0;
obj_ghost.vspeed = 0;
obj_ghost.jump = 10;
obj_ghost.speed = 4;
obj_ghost.direction = 0;
obj_ghost.create = function(){
    //ctx.drawImage(spr_block, x, y);
}

obj_ghost.step = function(x, y, id)
{

    var self = objects[id];
    
	if (self.up == "true" && place_meeting(obj_block, x, y + 1))
	{
		self.gravity -= obj_ghost.jump;
	}
	if (self.left == "true")
	{
		self.x -= obj_ghost.speed;
	}
	if (self.right == "true")
	{
		self.x += obj_ghost.speed;
	}
	if (!place_meeting(obj_block, x, y + self.gravity))
	{
		if (self.gravity < 6)
		{
			self.gravity += 0.5;
		}
		self.y += self.gravity;
	}
	else
	{
		self.gravity = 0;
	}
	
	draw_sprite(spr_player, self.direction, x, y);
	draw_text(self.uid, self.x - 8, self.y - 8);
}
