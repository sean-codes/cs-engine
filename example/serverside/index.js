// exmaple of a server side engine!
const CS = require('cs-engine')

const cs = new CS({
   objects: [

   ],

   start: () => {
      console.log('meow')
   }
})

console.log(cs);
