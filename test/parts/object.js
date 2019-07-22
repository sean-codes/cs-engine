cs.objects['obj_demo_0'] = {
   create: function() {},
   step: function() {},
   draw: function() {}
}

cs.objects['obj_demo_1'] = {
   create: function() {},
   step: function() {},
   draw: function() {}
}

testUtility.test({
   title: "cs.object",
   tests: [
      {
         name: 'create',
         should: 'creating an object',
         pass: function(pass, fail) {
            cs.object.reset()
            try {
               cs.object.create({
                  type: 'obj_demo_0'
               })
               pass()
            } catch(err) {
               fail()
            }

         }
      },
      {
         name: 'every',
         should: 'gets all obejcts in new/list',
         pass: function(pass, fail) {
            cs.object.reset()
            cs.object.create({ type: 'obj_demo_0' })
            cs.object.create({ type: 'obj_demo_1' })

            everyObject = cs.object.every()
            everyObject.length == 2 ? pass() : fail()
         }
      },
      {
         name: 'all',
         should: 'return all objects that match a type',
         pass: function(pass, fail) {
            cs.object.reset()
            cs.object.create({ type: 'obj_demo_1' })
            cs.object.create({ type: 'obj_demo_1' })

            allDemo1Objects = cs.object.all('obj_demo_1')
            allDemo1Objects.length == 2 ? pass() : fail()
         }
      },
      {
         name: 'find',
         should: 'return one object that matches type',
         pass: function(pass, fail) {
            cs.object.reset()
            cs.object.create({ type: 'obj_demo_0' })
            var foundObject = cs.object.find('obj_demo_0')
            foundObject && foundObject.core.type == 'obj_demo_0' ? pass() : fail()
         }
      }
   ]
})
