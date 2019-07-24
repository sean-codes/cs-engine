cs.objects['obj_light'] = {
   surface: 'light',

   create: ({ object, cs }) => {
      object.width = 30
      object.height = 30
   },

   draw: ({ object, cs }) => {
      cs.draw.setAlpha(0.9)
      cs.draw.fillRect({ x: 0, y: 0, width: cs.room.width, height: cs.room.height });

      for (var light of cs.global.lightList) {
         var obj = light.obj

         cs.draw.setOperation('xor');
         cs.draw.circleGradient({
            x: obj.x + light.xoff,
            y: obj.y + light.yoff,
            radius: light.size,
            colorStart: '#FFF',
            colorEnd: 'rgba(255, 255, 255, 0)'
         })
      }
   }
}
