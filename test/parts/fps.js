/* global cs, testUtility */

testUtility.test({
   collapse: true,
   title: "cs.fps",
   tests: [
      {
         name: 'rate',
         should: 'frame rate is around 60',
         pass: function(pass, fail) {
            setTimeout(() => {
               cs.fps.rate > 50 && cs.fps.rate < 65 ? pass() : fail()
            }, 1000)
         }
      }
   ]
})
