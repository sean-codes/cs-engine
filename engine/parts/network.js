//---------------------------------------------------------------------------------------------//
//------------------------------------| Networking |-------------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.network = {
   ws: {},
   status: false,
   buffer: [],
   overrides: {
      connect: function() {},
      disconnect: function() {},
      message: function() {}
   },

   connect: function(options) {
      // console.log('cs.network.connect', options)
      try {
         var host = options.host || window.location.host
         if (options.ssl == undefined || options.ssl == false) {
            var url = "ws://" + host + ":" + options.port
         } else {
            var url = "wss://" + host + ":" + options.port
         }
         var ws = new WebSocket(url);
         ws.onopen = function() {
            cs.network.onconnect()
         }
         ws.onclose = function() { cs.network.ondisconnect() }
         ws.onmessage = function(event) { cs.network.onmessage(event.data) }
         cs.network.ws = ws;
      } catch(e) {
         console.log(e);
      }
   },

   isConnected() {
      return cs.network.ws.readyState !== cs.network.ws.CLOSED
   },

   send: function(data) {
      if (!this.status) return
      if (typeof data !== 'string') {
         data = JSON.stringify(data)
      }
      cs.network.ws.send(data)
   },

   read: function() {
      while(this.buffer.length) {
         this.overrides.message(this.buffer.shift())
      }
   },

   onconnect: function() {
      cs.network.status = true
      this.overrides.connect()
   },

   ondisconnect: function() {
      cs.network.status = false
      this.overrides.disconnect()
   },

   onmessage: function(message) {
      this.buffer.push(message)
   },

   setup: function(options) {
      for (var optionName in options) {
         cs.network.overrides[optionName] = options[optionName]
      }
   }
}
