cs.script.networkSendMovement = function(keys){
	cs.network.send({
		type: 'movement',
		keys: keys
	});
}