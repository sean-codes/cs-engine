cs.script.networkSendMovement = function(obj){
    if(!cs.network.status) return;
    
	cs.network.send({
		type: 'movement',
		keys: obj.old_keys,
		x: obj.x,
		y: obj.y,
		hspeed: obj.hspeed,
		vspeed: obj.vspeed
	});
}
