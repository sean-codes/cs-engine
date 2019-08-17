// -------------------------------------------------------------------------- //
// -------------------------| CS ENGINE: INPUT TOUCH |----------------------- //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_INPUT_TOUCH {
      constructor(cs) {
         this.cs = cs
         this.eventsDownMove = []
         this.eventsUp = []
         this.list = [
            { id: -1, x: undefined, y: undefined, used: false }, // mouse
         ]

         this.eventFunctions = {
            down: this.eventFunctionDown.bind(this),
            move: this.eventFunctionMove.bind(this),
            up: this.eventFunctionUp.bind(this),
         }
      }

      batchDownMove() {
         while (this.eventsDownMove.length) {
            const event = this.eventsDownMove.shift()
            this.eventFunctions[event.type](event)
         }
      }

      batchUp() {
         while (this.eventsUp.length) {
            const event = this.eventsUp.shift()
            this.eventFunctions[event.type](event) // ok.... -.O
         }
      }

      eventFunctionDown(vEvent) {
         this.touchUse(vEvent.id)
      }

      eventFunctionUp(vEvent) {
         this.touchUnuse(vEvent.id)
      }

      eventFunctionMove(vEvent) {
         this.touchUpdate({
            id: vEvent.id,
            x: vEvent.x,
            y: vEvent.y,
         })
      }

      // modern pointers
      eventPointerDown(e) {
         e.preventDefault()

         this.eventsDownMove.push({
            type: 'down',
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
         })

         this.eventPointerMove(e)
      }

      eventPointerMove(e) {
         e.preventDefault()

         this.cs.inputMouse.x = e.clientX
         this.cs.inputMouse.y = e.clientY

         this.eventsDownMove.push({
            type: 'move',
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
         })
      }

      eventPointerUp(e) {
         e.preventDefault()

         this.eventsUp.push({
            type: 'up',
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
         })
      }

      // old touch
      eventTouchDown(e) {
         e.preventDefault()

         for (const touch of e.changedTouches) {
            this.eventsDownMove.push({
               type: 'down',
               id: touch.identifier,
               x: touch.clientX,
               y: touch.clientY,
            })

            this.eventTouchMove(e)
         }
      }

      eventTouchMove(e) {
         e.preventDefault()

         for (const touch of e.changedTouches) {
            this.eventsDownMove.push({
               type: 'move',
               id: touch.identifier,
               x: touch.clientX,
               y: touch.clientY,
            })
         }
      }

      eventTouchUp(e) {
         e.preventDefault()

         for (const touch of e.changedTouches) {
            this.eventsUp.push({
               type: 'up',
               id: touch.identifier,
               x: touch.clientX,
               y: touch.clientY,
            })
         }
      }

      touchUse(id) {
         // reuse from list or add to end
         let i = 0
         for (i = 0; i < this.list.length; i += 1) {
            const touch = this.list[i]
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
            y: undefined,
         }
      }

      touchUnuse(id) {
         const touch = this.list.find(t => t.id === id)
         if (!touch) {
            return
         }

         touch.used = false
         touch.held = false
         touch.up = true
      }

      touchUpdate(eTouch) {
         const touch = this.list.find(t => t.id === eTouch.id)
         if (!touch) return

         touch.x = (eTouch.x / this.cs.width) * this.cs.clampWidth
         touch.y = (eTouch.y / this.cs.height) * this.cs.clampHeight
      }

      observer(useGameCords) {
         return {
            parent: this,
            touch: undefined,
            observing: false,
            useGameCords: useGameCords,
            down: false,
            held: false,
            up: false,
            x: 0,
            y: 0,
            offsetX: 0,
            offsetY: 0,
            check: function (area) {
               if (this.observing) this.observe()
               else this.findTouchToObserve(area)
            },
            uncheck: function () {
               this.observing = false
            },
            observe: function () {
               // im observing. lets update my values
               if (this.observing) {
                  this.x = this.touch.x
                  this.y = this.touch.y

                  if (this.useGameCords) {
                     const convertedToGameCords = this.parent.convertToGameCords(this.x, this.y)
                     this.x = convertedToGameCords.x
                     this.y = convertedToGameCords.y
                  }

                  this.down = this.touch.down
                  this.held = this.touch.held
                  this.up = this.touch.up

                  if (this.up) this.observing = false
               }
            },
            findTouchToObserve(area) {
               // find a touch to observe
               for (const touch of this.parent.list) {
                  // this touch is being observed or not available to latch
                  if (touch.used || !touch.down) continue

                  let touchX = touch.x
                  let touchY = touch.y
                  if (this.useGameCords) {
                     const convertedToGameCords = this.parent.convertToGameCords(touchX, touchY)
                     touchX = convertedToGameCords.x
                     touchY = convertedToGameCords.y
                  }

                  // check if within
                  if (
                     touchX > area.x && touchX < area.x + (area.width || area.size)
                     && touchY > area.y && touchY < area.y + (area.height || area.size)
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
            isDown: function () {
               return this.touch && this.touch.down
            },
            isUp: function () {
               return this.touch && this.touch.up
            },
            isHeld: function () {
               return this.touch && this.touch.held
            },
            isWithin: function (rect) {
               const width = this.parent.cs.default(rect.width, rect.size || 0)
               const height = this.parent.cs.default(rect.height, rect.size || 0)

               return (
                  this.x > rect.x && this.x < rect.x + width
                  && this.y > rect.y && this.y < rect.y + height
               )
            },
         }
      }

      reset() {
         // up and down state only last one step
         for (const touch of this.list) {
            touch.down = false
            touch.up = false
            touch.new = false
         }
      }

      convertToGameCords(x, y) {
         const rect = this.cs.canvas.getBoundingClientRect()

         const physicalViewWidth = rect.width
         const physicalViewHeight = rect.height
         const hortPercent = (x - rect.left) / physicalViewWidth
         const vertPercent = (y - rect.top) / physicalViewHeight

         let gamex = Math.round(hortPercent * (this.cs.camera.width / this.cs.camera.zoom))
         let gamey = Math.round(vertPercent * (this.cs.camera.height / this.cs.camera.zoom))
         gamex += this.cs.camera.x
         gamey += this.cs.camera.y
         return { x: gamex, y: gamey }
      }
   }

   // export (node / web)
   if (typeof module !== 'undefined') module.exports = CSENGINE_INPUT_TOUCH
   else cs.inputTouch = new CSENGINE_INPUT_TOUCH(cs) // eslint-disable-line no-undef
})()
