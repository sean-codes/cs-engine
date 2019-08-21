/* global cs, testUtility */

testUtility.test({
   collapse: true,
   title: "cs.timer",
   tests: [
      {
         name: 'create',
         should: 'creating a timer has properties',
         pass: function(pass, fail) {
            var timerNew = cs.timer.create({ duration: 15 })

            if ( typeof timerNew.percent === 'number'
               && typeof timerNew.time === 'number'
               && timerNew.duration === 15
            ) {
               return pass()
            }

            fail()
         }
      },
      {
         name: 'start',
         should: 'start adds timer to list',
         pass: function(pass, fail) {
            var timerNew = cs.timer.create({
               duration: 15
            })

            cs.timer.start(timerNew)

            if(cs.timer.list.length === 1) pass()
            fail()
         }
      },
      {
         name: 'end',
         should: 'after a timer is ran it is not in the list',
         pass: function(pass, fail) {
            var timerNew = cs.timer.create({
               duration: 15
            })

            cs.timer.start(timerNew)

            setTimeout(function() {
               var foundTimer = cs.timer.list.find(function(timer) {
                  timer.id === timerNew.id
               })

               if (!foundTimer) {
                  return pass()
               }
               fail()
            }, 500)
         }
      },
      {
         name: 'start function called at start',
         should: 'run start function when started',
         pass: function(pass, fail) {
            var started = false
            var ended = false

            var timerNew = cs.timer.create({
               duration: 10,
               onStart: function() {
                  started = true
               },
               onEnd: function() {
                  ended = true
               }
            })

            cs.timer.start(timerNew)


            setTimeout(function() {
               if(started && ended) return pass()
               fail()
            }, 500)
         }
      }
   ]
})
