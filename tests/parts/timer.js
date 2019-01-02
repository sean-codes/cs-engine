testUtility.test({
   title: "cs.timer",
   tests: [
      {
         name: 'add',
         should: 'adding to list',
         pass: function(pass, fail) {
            var newTimer = cs.timer.add({
               duration: 15,
               start: function() { },
               end: function() { }
            })

            if (
               newTimer.percent !== undefined,
               newTimer.duration == 15,
               typeof newTimer.time  == 0,
               typeof newTimer.start  == 'function',
               typeof newTimer.end  == 'function'
            ) {
               return pass()
            }

            fail()
         }
      }
   ]
})
