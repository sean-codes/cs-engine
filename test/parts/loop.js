/* global cs, testUtility */

testUtility.test({
   collapse: true,
   title: "cs.loop",
   tests: [
      {
         name: 'endStep',
         should: 'adding endStep runs only once at end of loop',
         pass: function(pass, fail) {
            var functionRan = 0
            cs.loop.endStep(() => {
               functionRan += 1
            })

            setTimeout(() => {
               functionRan === 1 ? pass() : fail()
            }, 100)
         }
      }
   ]
})
