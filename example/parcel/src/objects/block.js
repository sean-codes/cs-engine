module.exports = {
   create({ object, cs }) {
   },

   draw({ object, cs }) {
      // console.log('draw')
      cs.draw.setColor('red')
      cs.draw.fillRect({
         x: 0, y: 0, width: 100, height: 100
      })
   }
}
