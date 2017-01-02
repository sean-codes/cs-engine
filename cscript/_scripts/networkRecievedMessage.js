cs.script.networkReceivedMessage = function(message){
	var message = JSON.parse(message);
	switch(message.type){
		case 'connect':
			console.log('My ID is: ' + message.id);
			cs.network.send({
				type: 'connect'
			});
			break;

		case 'newPlayers':
			message.list.forEach(function(player){
				console.log('add new player: ' + player.id);
				var newPlayer = cs.obj.create('obj_otherplayer', 100, 100);
				cs.global.networkControl.list.push({
					id: player.id,
					obj: cs.obj.list[newPlayer]
				});
			});
			break;

		case 'movement':
			console.log(message.keys);
			cs.global.networkControl.list.forEach(function(player){
				if(player.id == message.id){
					console.log('make it happen');
					player.obj.keys = message.keys;
				}
			})
			break;
	}
}