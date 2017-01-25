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
				cs.global.networkControl.list[player.id] = {
					id: player.id,
					obj: newPlayer
				};
			});
			break;

		case 'endPlayers':
			message.list.forEach(function(player){
				cs.obj.destroy(cs.global.networkControl.list[player.id].obj.id);
			});
			break;

		case 'movement':
			var obj = cs.global.networkControl.list[message.id].obj;
			obj.keys = message.keys;
			obj.x = message.x;
			obj.y = message.y;
			obj.hspeed = message.hspeed;
			obj.vspeed = message.vspeed;
			break;
	}
}
