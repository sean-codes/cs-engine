/* global cs */

cs.script.network = {
   init: function() {
      cs.network.setup({
         connect: this.onConnect.bind(this),
         disconnect: this.onDisconnect.bind(this),
         message: this.onMessage.bind(this)
      })

      cs.network.connect({ port: 9999 })
   },

   ping: function() {
      this.send({
         func: 'ping',
         data: { now: Date.now() }
      })
   },

   send: function(data) {
      cs.network.send(data)
   },

   onConnect: function() {},
   onDisconnect: function() {},

   onMessage: function({ message }) {
      try {
         message = JSON.parse(message)
         this.functions[message.func](message.data)
      } catch(e) {
         console.log('message error', message, e)
      }
   },

   functions: {
      'connect': function(data) {
         console.log('connect', data)
         cs.global.socketId = data
      },

      'ping': function(data) {
         cs.global.ping = data.ping
         cs.script.network.send({ func: 'ping', data: data.now })
      },

      'object-create': function(data) {
         cs.script.networkObjects.objectCreate(data)
      },

      'object-change': function(data) {
         cs.script.networkObjects.objectChange(data)
      },

      'object-destroy': function(data) {
         cs.script.networkObjects.objectDestroy(data)
      },

      'snapshot': function(snapshots) {
         cs.script.networkObjects.objectSnapshots(snapshots)
      }
   }
}
