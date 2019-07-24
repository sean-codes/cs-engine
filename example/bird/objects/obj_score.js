cs.objects['obj_score'] = {
   create: ({ object, cs }) => {
      object.mask = { x: 0, y: 0, width: 2, height: 40 }
   },

   draw: ({ object, cs }) => {
      object.x -= cs.global.speed
   }
}

cs.objects['obj_score_text'] = {
   zIndex: 21,
   create: ({ object, cs }) => {
      object.text = cs.math.choose([
         '+1 Nice dive!',
         '+1 Daredevil!',
         '+1 Dangerous!',
         '+1 Holy Smokes!'
      ])

      object.timer = 60
   },

   draw: ({ object, cs }) => {
      object.y -= 1
      object.x -= cs.global.speed
      object.timer -= 1

      cs.draw.setTextCenter()
      cs.draw.setColor('#FFF38E')
      cs.draw.setFont({ effect: 'bold', size: 8, family: 'monospace'})
      cs.draw.text({ x: object.x, y: object.y, text: object.text })

      if (object.timer == 0) {
         cs.object.destroy(object)
      }
   }
}
