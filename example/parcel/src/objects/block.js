module.exports = {
   create({ object, cs }) {

   },

   draw({ object, cs }) {
      console.log('draw')
      cs.draw.fillRect({
         x: 0, y: 0, width: 10, height: 10
      })
   }
}
