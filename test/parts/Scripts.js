/* global cs, testUtility */

cs.scripts.add('test', {
   aConstant: 'test',
   returnThisCs: function() {
      return this.cs
   },

   returnThisAConstant: function() {
      return this.aConstant
   },

   nested: {
      returnThisCsNested: function() {
         return this.cs
      },

      returnThisAConstant: function() {
         return this.aConstant
      }
   }
})

testUtility.test({
   collapse: true,
   title: "cs.scripts",
   tests: [
      {
         name: 'scope',
         should: 'make sure this.cs scope is setup',
         pass: function(pass, fail) {
            const thisCs = cs.script.test.returnThisCs()
            const nestedThisCs = cs.script.test.nested.returnThisCsNested()
            const thisAConstant = cs.script.test.nested.returnThisAConstant()
            const nestedThisAConstant = cs.script.test.nested.returnThisAConstant()

            if (!thisCs && typeof thisCs !== 'object') fail('this.cs not available in relative function')
            if (!nestedThisCs && typeof nestedThisCs !== 'object') fail('this.cs not available in nested function')
            if (thisAConstant !== 'test') fail('this.aConstant not available in relative function')
            if (nestedThisAConstant !== 'test') fail('this.aConstant not available in nested function')
            pass()
         }
      },
   ]
})
