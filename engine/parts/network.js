//---------------------------------------------------------------------------------------------//
//------------------------------------| Networking |-------------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.network = {
   ws: {},
   status: false,
   connect: function(options) {
      var host = options.host || window.location.host;
      if (options.ssl == undefined || options.ssl == false) {
         var url = "ws://" + host + ":" + options.port;
      } else {
         var url = "wss://" + host + ":" + options.port;
      }
      var ws = new WebSocket(url);
      ws.onopen = function() { cs.network.onconnect();
         cs.network.status = true; }
      ws.onclose = function() { cs.network.ondisconnect() }
      ws.onmessage = function(event) { cs.network.onmessage(event.data) }
      cs.network.ws = ws;
   },
   send: function(data) {
      if (typeof data !== 'string') {
         data = JSON.stringify(data);
      }
      cs.network.ws.send(data);
   },
   onconnect: function() {},
   ondisconnect: function() {},
   onmessage: function(message) {}
}
