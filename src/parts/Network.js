//----------------------------------------------------------------------------//
//----------------------------| CS ENGINE: NETWORK |--------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_NETWORK {
      constructor(cs) {
         this.cs = cs

         this.ws = {}
         this.status = false
         this.buffer = []

         this.metrics = {
            upNow: 0,
            downNow: 0,
            upAverage: 0,
            downAverage: 0,
            upTotal: 0,
            downTotal: 0,
            upWatch: 0,
            downWatch: 0,
            last: Date.now(),
            count: 0
         }

         this.overrides = {
            connect: function() {},
            disconnect: function() {},
            message: function() {},
         }
      }

      updateMetrics() {
         var metrics = cs.network.metrics
         var now = Date.now()
         if (now - metrics.last > 1000) {
            metrics.count++
            metrics.last = now
            metrics.upNow = metrics.upWatch
            metrics.downNow = metrics.downWatch
            metrics.upTotal += metrics.upWatch
            metrics.downTotal += metrics.downWatch
            metrics.upAverage = metrics.upTotal / metrics.count
            metrics.downAverage = metrics.downTotal / metrics.count

            metrics.upWatch = 0
            metrics.downWatch = 0
         }
      }

      connect(options) {
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
      }

      isConnected() {
         return cs.network.ws.readyState !== cs.network.ws.CLOSED
      }

      send(data) {
         if (!this.status) return
         if (typeof data !== 'string') {
            data = JSON.stringify(data)
         }
         cs.network.metrics.upWatch += data.length
         cs.network.ws.send(data)
      }

      read() {
         while(this.buffer.length) {
            var data = this.buffer.shift()
            cs.network.metrics.downWatch += data.length
            this.overrides.message(data)
         }
      }

      onconnect() {
         cs.network.status = true
         this.overrides.connect()
      }

      ondisconnect() {
         cs.network.status = false
         this.overrides.disconnect()
      }

      onmessage(message) {
         this.buffer.push(message)
      }

      setup(options) {
         for (var optionName in options) {
            cs.network.overrides[optionName] = options[optionName]
         }
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_NETWORK
      : cs.network = new CSENGINE_NETWORK(cs)
})()
