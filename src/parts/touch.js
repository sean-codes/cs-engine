//---------------------------------------------------------------------------------------------//
//-------------------------------| Touch Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.touch = {
   eventsDownMove: [],
   eventsUp: [],
   list: [
      { id: -1, x: undefined, y: undefined, used: false } // mouse
   ],

   batchDownMove: function() {
      while(this.eventsDownMove.length) {
         var event = this.eventsDownMove.shift()
         this.eventFunc[event.type](event)
      }
   },

   batchUp: function() {
      while(this.eventsUp.length) {
         var event = this.eventsUp.shift()
         this.eventFunc[event.type](event)
      }
   },

   eventFunc: {
      down: function(vEvent) {
         cs.touch.touchUse(vEvent.id)
      },

      move: function(vEvent) {
         cs.touch.touchUpdate({
            id: vEvent.id,
            x: vEvent.x,
            y: vEvent.y
         })
      },

      up: function(vEvent) {
         cs.touch.touchUnuse(vEvent.id)
      }
   },

   // modern pointers
   eventPointerDown: function(e) {
      e.preventDefault()

      cs.touch.eventsDownMove.push({
         type: 'down',
         id: e.pointerId,
         x: e.clientX,
         y: e.clientY
      })

      cs.touch.eventPointerMove(e)
   },

   eventPointerMove: function(e) {
      e.preventDefault()

      cs.mouse.x = e.clientX
      cs.mouse.y = e.clientY

      cs.touch.eventsDownMove.push({
         type: 'move',
         id: e.pointerId,
         x: e.clientX,
         y: e.clientY
      })
   },

   eventPointerUp: function(e) {
      e.preventDefault()

      cs.touch.eventsUp.push({
         type: 'up',
         id: e.pointerId,
         x: e.clientX,
         y: e.clientY
      })
   },

   // old touch
   eventTouchDown: function(e) {
      e.preventDefault()

      for (var touch of e.changedTouches) {
         cs.touch.eventsDownMove.push({
            type: 'down',
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
         })

         cs.touch.eventTouchMove(e)
      }
   },

   eventTouchMove: function(e) {
      e.preventDefault()

      for (var touch of e.changedTouches) {
         cs.touch.eventsDownMove.push({
            type: 'move',
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
         })
      }
   },

   eventTouchUp: function(e) {
      e.preventDefault()

      for (var touch of e.changedTouches) {
         cs.touch.eventsUp.push({
            type: 'up',
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
         })
      }
   },

   touchUse: function(id) {
      // reuse from list or add to end
      for (var i = 0; i < cs.touch.list.length; i++) {
         var touch = cs.touch.list[i]
         if (!touch.used && !touch.new) break
      }

      cs.touch.list[i] = {
         id: id,
         used: false,
         new: true,
         down: true,
         held: true,
         up: false,
         x: undefined,
         y: undefined
      }
   },

   touchUnuse: function(id) {
      var touch = cs.touch.list.find(function(t) { return t.id == id })
      if (!touch) {
         return
      }

      touch.used = false
      touch.held = false
      touch.up = true
   },

   touchUpdate: function(eTouch) {
      var touch = cs.touch.list.find(function(t) { return t.id == eTouch.id })
      if (!touch) return


      touch.x = eTouch.x / cs.width * cs.clampWidth
      touch.y = eTouch.y / cs.height * cs.clampHeight
   },

   observer: function(useGameCords) {
      return {
         observing: false,
         useGameCords: useGameCords,
         down: false,
         held: false,
         up: false,
         x: 0,
         y: 0,
         offsetX: 0,
         offsetY: 0,
         check: function(area) {
            this.observing ?
               this.observe() :
               this.findTouchToObserve(area)
         },
         uncheck: function() {
            this.observing = false
         },
         observe: function() {
            // im observing. lets update my values
            if (this.observing) {
               this.x = this.touch.x
               this.y = this.touch.y
               if (this.useGameCords) {
                  var convertedToGameCords = cs.touch.convertToGameCords(this.x, this.y)
                  this.x = convertedToGameCords.x
                  this.y = convertedToGameCords.y
               }

               this.down = this.touch.down
               this.held = this.touch.held
               this.up = this.touch.up

               if (this.up) this.observing = false
               return
            }
         },
         findTouchToObserve(area) {
            // find a touch to observe
            for (var touch of cs.touch.list) {
               // this touch is being observed or not available to latch
               if (touch.used || !touch.down) continue

               var touchX = touch.x
               var touchY = touch.y
               if (this.useGameCords) {
                  var convertedToGameCords = cs.touch.convertToGameCords(touchX, touchY)
                  touchX = convertedToGameCords.x
                  touchY = convertedToGameCords.y
               }

               // check if within
               if (
                  touchX > area.x && touchX < area.x + (area.width || area.size) &&
                  touchY > area.y && touchY < area.y + (area.height || area.size)
               ) {
                  // observe this touch!
                  touch.used = true

                  // setup
                  this.observing = true
                  this.touch = touch
                  // handy
                  this.offsetX = touchX - area.x
                  this.offsetY = touchY - area.y

                  this.observe()
                  break
               }
            }
         },
         isDown: function() {
            return this.touch && this.touch.down
         },
         isUp: function() {
            return this.touch && this.touch.up
         },
         isHeld: function() {
            return this.touch && this.touch.held
         },
         isWithin: function(rect) {
            var width = cs.default(rect.width, rect.size || 0)
            var height = cs.default(rect.height, rect.size || 0)

            return (
               this.x > rect.x && this.x < rect.x + width &&
               this.y > rect.y && this.y < rect.y + height
            )
         }
      }
   },

   reset: function() {
      // up and down state only last one step
      for (var touch of cs.touch.list) {
         touch.down = false
         touch.up = false
         touch.new = false
      }
   },

   convertToGameCords: function(x, y) {
      var rect = cs.canvas.getBoundingClientRect();

      var physicalViewWidth = rect.width
      var physicalViewHeight = rect.height
      var hortPercent = (x - rect.left) / physicalViewWidth
      var vertPercent = (y - rect.top) / physicalViewHeight

      var gamex = Math.round(hortPercent * (cs.camera.width / cs.camera.zoom))
      var gamey = Math.round(vertPercent * (cs.camera.height / cs.camera.zoom))
      gamex = (gamex) + cs.camera.x
      gamey = (gamey) + cs.camera.y
      return { x: gamex, y: gamey }
   }
}
