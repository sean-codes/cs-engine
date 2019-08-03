cs.objects.background = {
   surface: 'background',

   create: function() {

   },

   drawOnce: function() {
      bgSquareSize = 9
      for (var x = 0; x <= Math.ceil(cs.room.width / bgSquareSize); x++) {
         for (var y = 0; y <= Math.ceil(cs.room.height / bgSquareSize); y++) {
            cs.draw.setColor(cs.math.choose(['#F55', '#C22', '#555']))
            cs.draw.fillRect({
               x: x * bgSquareSize,
               y: y * bgSquareSize,
               width: bgSquareSize,
               height: bgSquareSize
            })
         }
      }
   }
}
