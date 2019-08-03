cs.script.network = {
   init: function() {
      cs.network.setup({
         connect: this.onConnect.bind(this),
         disconnect: this.onDisconnect.bind(this),
         message: this.onMessage.bind(this)
      })

      cs.network.connect({ port: 9999 })
   },

   connect: function() {

   },

   send: function(data) {
      cs.network.send(data)
   },

   onConnect: function() {

   },

   onDisconnect: function() {

   },

   onMessage: function(data) {
      try {
         var message = JSON.parse(data)
         cs.script.networkFunctions[message.func](message.data)
      } catch(e) {
         console.log('message error', e)
      }
   }
}
