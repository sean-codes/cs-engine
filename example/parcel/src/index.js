// exmaple of a server side engine!
const CS = require('cs-engine')

window.cs = new CS({
   canvas: canvas,

   assets: {
      objects: [
         { type: 'block', src: require('./objects/block') }
      ]
   },

   start: ({ cs }) => {
      console.log('running start')

      cs.object.create({
         type: 'block'
      })
   }
})

console.log(cs);
