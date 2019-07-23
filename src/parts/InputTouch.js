//---------------------------------------------------------------------------------------------//
//-------------------------------| Touch Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
class CSENGINE_INPUT_TOUCH {
   constructor(cs) {
      this.cs = cs
      this.eventsDownMove = []
      this.eventsUp = []
      this.list = [
         { id: -1, x: undefined, y: undefined, used: false } // mouse
      ]
   }

   batchDownMove() {
      while(this.eventsDownMove.length) {
         var event = this.eventsDownMove.shift()
         this.eventFunc[event.type](event)
      }
   }

   batchUp() {
      while(this.eventsUp.length) {
         var event = this.eventsUp.shift()
         this[{
            down: this.eventFuncDown,
            up: this.eventFuncUp,
            move:  this.eventFuncMove,
         }[event.type]](event) // ok.... -.O
      }
   }

   eventFuncDown() {
      this.touchUse(vEvent.id)
   }

   eventFuncUp() {
      this.touchUnuse(vEvent.id)
   }

   eventFuncMove() {
      this.touchUpdate({
         id: vEvent.id,
         x: vEvent.x,
         y: vEvent.y
      })
   }

   // modern pointers
   eventPointerDown(e) {
      e.preventDefault()

      this.eventsDownMove.push({
         type: 'down',
         id: e.pointerId,
         x: e.clientX,
         y: e.clientY
      })

      this.eventPointerMove(e)
   }

   eventPointerMove(e) {
      e.preventDefault()

      this.cs.mouse.x = e.clientX
      this.cs.mouse.y = e.clientY

      this.eventsDownMove.push({
         type: 'move',
         id: e.pointerId,
         x: e.clientX,
         y: e.clientY
      })
   }

   eventPointerUp(e) {
      e.preventDefault()

      this.eventsUp.push({
         type: 'up',
         id: e.pointerId,
         x: e.clientX,
         y: e.clientY
      })
   }

   // old touch
   eventTouchDown(e) {
      e.preventDefault()

      for (var touch of e.changedTouches) {
         this.eventsDownMove.push({
            type: 'down',
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
         })

         this.eventTouchMove(e)
      }
   }

   eventTouchMove(e) {
      e.preventDefault()

      for (var touch of e.changedTouches) {
         this.eventsDownMove.push({
            type: 'move',
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
         })
      }
   }

   eventTouchUp(e) {
      e.preventDefault()

      for (var touch of e.changedTouches) {
         this.eventsUp.push({
            type: 'up',
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
         })
      }
   }

   touchUse(id) {
      // reuse from list or add to end
      for (var i = 0; i < this.list.length; i++) {
         var touch = this.list[i]
         if (!touch.used && !touch.new) break
      }

      this.list[i] = {
         id: id,
         used: false,
         new: true,
         down: true,
         held: true,
         up: false,
         x: undefined,
         y: undefined
      }
   }

   touchUnuse(id) {
      var touch = this.list.find(function(t) { return t.id == id })
      if (!touch) {
         return
      }

      touch.used = false
      touch.held = false
      touch.up = true
   }

   touchUpdate(eTouch) {
      var touch = this.list.find(function(t) { return t.id == eTouch.id })
      if (!touch) return


      touch.x = eTouch.x / this.cs.width * this.cs.clampWidth
      touch.y = eTouch.y / this.cs.height * this.cs.clampHeight
   }

   observer(useGameCords) {
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
                  var convertedToGameCords = this.convertToGameCords(this.x, this.y)
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
            for (var touch of this.list) {
               // this touch is being observed or not available to latch
               if (touch.used || !touch.down) continue

               var touchX = touch.x
               var touchY = touch.y
               if (this.useGameCords) {
                  var convertedToGameCords = this.convertToGameCords(touchX, touchY)
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
            var width = this.cs.default(rect.width, rect.size || 0)
            var height = this.cs.default(rect.height, rect.size || 0)

            return (
               this.x > rect.x && this.x < rect.x + width &&
               this.y > rect.y && this.y < rect.y + height
            )
         }
      }
   }

   reset() {
      // up and down state only last one step
      for (var touch of this.list) {
         touch.down = false
         touch.up = false
         touch.new = false
      }
   }

   convertToGameCords(x, y) {
      var rect = this.cs.canvas.getBoundingClientRect();

      var physicalViewWidth = rect.width
      var physicalViewHeight = rect.height
      var hortPercent = (x - rect.left) / physicalViewWidth
      var vertPercent = (y - rect.top) / physicalViewHeight

      var gamex = Math.round(hortPercent * (this.cs.camera.width / this.cs.camera.zoom))
      var gamey = Math.round(vertPercent * (this.cs.camera.height / this.cs.camera.zoom))
      gamex = (gamex) + this.cs.camera.x
      gamey = (gamey) + this.cs.camera.y
      return { x: gamex, y: gamey }
   }
}

if (module) module.exports = CSENGINE_INPUT_TOUCH
