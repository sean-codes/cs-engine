cs.network.onconnect = function() {
   console.log('event override connected!');
}

cs.network.ondisconnect = function() {
   console.log('Disconnected! :(');
}

cs.network.onmessage = function(data) {
   cs.scripts.network.receivedMessage(data);
}
