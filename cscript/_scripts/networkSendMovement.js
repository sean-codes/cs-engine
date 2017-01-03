cs.script.networkSendMovement = function(obj){
	cs.network.send({
		type: 'movement',
		keys: obj.old_keys,
		x: obj.x,
		y: obj.y,
		hspeed: obj.hspeed,
		vspeed: obj.vspeed
	});
}