cs.objects.background = {
   surface: 'background',

   create: function() {

   },

   drawOnce: function() {
      bgSquareSize = 5
      for (var x = 0; x <= Math.ceil(cs.room.width / bgSquareSize); x++) {
         for (var y = 0; y <= Math.ceil(cs.room.height / bgSquareSize); y++) {
            cs.draw.setColor(cs.math.choose(['#f66', '#b55', '#555']))
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
