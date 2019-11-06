/* global cs, testUtility */

testUtility.test({
   collapse: true,
   title: "cs.vector",
   tests: [
      {
         name: 'equal',
         should: 'checks v0 components equal v1 components',
         pass: function(pass, fail) {
            var v0 = cs.vector.create(0, 0)
            var v1 = cs.vector.create(1, 1)

            return (
               !cs.vector.equal(v0, v1)
               && cs.vector.equal(v0, v0)
               && cs.vector.equal(v1, v1)
            ) ? pass() : fail()
         }
      }
   ]
})
