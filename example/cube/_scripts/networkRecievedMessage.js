cs.script.networkReceivedMessage = function(message){
	var network = cs.global.networkControl;
	var message = JSON.parse(message);

	switch(message.type){
		case 'connect':
			console.log('Connected ID: ' + message.id);
			network.id = message.id;
			cs.network.send({ type: 'connect', x: network.x, y: network.y });
			break;

		case 'newPlayers':
			console.log(message);
			message.list.forEach(function(player){
				var newPlayer = cs.obj.create('obj_otherplayer', player.x, player.y);
				network.list[player.id] = {
					id: player.id,
					obj: cs.obj.list[newPlayer]
				};
			});
			break;

		case 'endPlayers':
			message.list.forEach(function(player){
				cs.obj.destroy(network.list[player.id].obj.id);
			});
			break;

		case 'movement':
			var obj = network.list[message.id].obj;
			obj.keys = message.keys;
			obj.x = message.x; 
			obj.y = message.y;
			obj.hspeed = message.hspeed;
			obj.vspeed = message.vspeed;
			break;
	}
}