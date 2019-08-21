/* global cs, testUtility */

var exampleKeyBoardEvent = {
   keyCode: 39,
   preventDefault: () => {}
}

var exampleKeyBoardEvent2 = {
   keyCode: 40,
   preventDefault: () => {}
}

testUtility.test({
   collapse: true,
   title: "cs.inputKeyboard",
   tests: [
      {
         name: 'keyEvent down/up',
         should: 'adding an event adds to array',
         pass: function(pass, fail) {
            cs.inputKeyboard.eventDown(exampleKeyBoardEvent)
            cs.inputKeyboard.eventUp(exampleKeyBoardEvent)
            var keyEventDown = cs.inputKeyboard.events[0]
            var keyEventUp = cs.inputKeyboard.events[1]

            if(keyEventDown && keyEventUp) {
               var keyIsDown = keyEventDown.event === 'down'
               var keyIsUp = keyEventUp.event === 'up'
               var keyMatchesCode = keyEventDown.key === 39 && keyEventUp.key === 39
               if(keyIsDown && keyIsUp && keyMatchesCode) return pass()
            }

            fail()
         }
      },
      {
         name: 'reading key up/down once',
         should: 'we should be able read read keydown once',
         pass: function(pass, fail) {
            cs.inputKeyboard.eventDown(exampleKeyBoardEvent)
            cs.inputKeyboard.eventUp(exampleKeyBoardEvent)
            cs.loop.beforeStep(() => {
               var keyDownOnce = cs.inputKeyboard.down(exampleKeyBoardEvent.keyCode)
               var keyUpOnce = cs.inputKeyboard.up(exampleKeyBoardEvent.keyCode)
               cs.loop.beforeStep(() => {
                  var keyDownTwice = cs.inputKeyboard.down(exampleKeyBoardEvent.keyCode)
                  var keyUpTwice = cs.inputKeyboard.up(exampleKeyBoardEvent.keyCode)

                  var once = keyDownOnce && keyUpOnce
                  var notTwice = !keyDownTwice && ! keyUpTwice
                  once && notTwice ? pass() : fail()
               })
            })
         }
      },
      {
         name: 'virtual keyup not called if key isnt down',
         should: 'virtual keyup not called if key isnt down/held',
         pass: function(pass, fail) {
            cs.inputKeyboard.virtualUp(exampleKeyBoardEvent2.keyCode)
            cs.loop.beforeStep(() => {
               var keyUp = cs.inputKeyboard.up(exampleKeyBoardEvent2.keyCode)
               keyUp ? fail() : pass()
            })
         }
      }
   ]
})
