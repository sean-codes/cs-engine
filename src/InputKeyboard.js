// -------------------------------------------------------------------------- //
// -----------------------| CS ENGINE: INPUT KEYBOARD |---------------------- //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_INPUT_KEYBOARD {
      constructor(cs) {
         this.cs = cs

         this.upList = {}
         this.downList = {}
         this.heldList = {}
         this.events = []
      }

      addEvent(keyCode, eventType) {
         const num = this.events.length
         this.events[num] = {
            event: eventType,
            key: keyCode,
         }
      }

      execute() {
         for (let i = 0; i < this.events.length; i += 1) {
            const { event, key } = this.events[i]
            this.processEvent(key, event)
         }
         this.events = []
      }

      processEvent(keyCode, type) {
         if (type === 'up') {
            if (!this.heldList[keyCode]) return
            this.upList[keyCode] = performance.now()
            return
         }

         this.downList[keyCode] = performance.now()
         this.heldList[keyCode] = performance.now()
      }

      reset() {
         for (const tmp in this.downList) {
            this.downList[tmp] = false
            if (this.upList[tmp]) {
               this.heldList[tmp] = false
            }

            this.upList[tmp] = false
         }
      }

      blur() {
         for (const keyId in this.downList) {
            this.downList[keyId] = false
            this.heldList[keyId] = false
            this.upList[keyId] = false
         }

         this.events = []
      }

      eventDown(keyEvent) {
         keyEvent.preventDefault()
         if (!keyEvent.repeat) {
            this.virtualDown(Number(keyEvent.keyCode))
         }
      }

      eventUp(keyEvent) {
         this.virtualUp(Number(keyEvent.keyCode))
      }

      virtualDown(keyCode) {
         this.addEvent(Number(keyCode), 'down')
      }

      virtualUp(keyCode) {
         this.addEvent(Number(keyCode), 'up')
      }

      virtualPress(key) {
         this.virtualDown(key)
         this.virtualUp(key)
      }

      up(keyID) {
         return this.upList[keyID] || false
      }

      down(keyID) {
         return this.downList[keyID] || false
      }

      held(keyID) {
         return this.heldList[keyID] || false
      }

      isUp(keyID) {
         return this.upList[keyID] ? true : false
      }

      isDown(keyID) {
         return this.downList[keyID] ? true : false
      }

      isHeld(keyID) {
         return this.heldList[keyID] ? true : false
      }
   }

   // export (node / web)
   if (typeof module !== 'undefined') module.exports = CSENGINE_INPUT_KEYBOARD
   else cs.inputKeyboard = new CSENGINE_INPUT_KEYBOARD(cs) // eslint-disable-line no-undef
})()
