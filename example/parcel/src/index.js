// exmaple of a server side engine!
const CS = require('cs-engine')

window.cs = new CS({
   canvas: canvas,

   objects: {
      'block': require('./objects/block')
   },

   start: ({ cs }) => {
      console.log('running start')
      
      cs.object.create({
         type: 'block'
      })
   }
})
