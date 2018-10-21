var exampleKeyBoardEvent = {
   keyCode: '39',
   preventDefault: () => {}
}

var exampleKeyBoardEvent2 = {
   keyCode: '40',
   preventDefault: () => {}
}

testUtility.test({
   title: "cs.keys",
   tests: [
      {
         name: 'keyEvent down/up',
         should: 'adding an event adds to array',
         pass: function(pass, fail) {
            cs.key.eventDown(exampleKeyBoardEvent)
            cs.key.eventUp(exampleKeyBoardEvent)
            var keyEventDown = cs.key.events[0]
            var keyEventUp = cs.key.events[1]

            if(keyEventDown && keyEventUp) {
               var keyIsDown = keyEventDown.event == 'down'
               var keyIsUp = keyEventUp.event == 'up'
               var keyMatchesCode = keyEventDown.key == 39 && keyEventUp.key == 39
               if(keyIsDown && keyIsUp && keyMatchesCode) return pass()
            }

            fail()
         }
      },
      {
         name: 'reading key up/down once',
         should: 'we should be able read read keydown once',
         pass: function(pass, fail) {
            cs.key.eventDown(exampleKeyBoardEvent)
            cs.key.eventUp(exampleKeyBoardEvent)
            cs.loop.beforeStep(() => {
               var keyDownOnce = cs.key.down(exampleKeyBoardEvent.keyCode)
               var keyUpOnce = cs.key.up(exampleKeyBoardEvent.keyCode)
               cs.loop.beforeStep(() => {
                  var keyDownTwice = cs.key.down(exampleKeyBoardEvent.keyCode)
                  var keyUpTwice = cs.key.up(exampleKeyBoardEvent.keyCode)

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
            cs.key.virtualUp(exampleKeyBoardEvent2.keyCode)
            cs.loop.beforeStep(() => {
               var keyUp = cs.key.up(exampleKeyBoardEvent2.keyCode)
               keyUp ? fail() : pass()
            })
         }
      }
   ]
})
