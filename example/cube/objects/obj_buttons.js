cs.object.addTemplate({
   type: 'obj_buttons',

   create: ({ object, cs }) => {
      object.width = 30;
      object.height = 30;
      object.touch = cs.inputTouch.observer()
   },

   step: ({ object, cs }) => {
      var btnRect = {
         x: cs.draw.surface.width - 50,
         y: cs.draw.surface.height - 50,
         width: object.width,
         height: object.height
      }

      object.touch.check(btnRect);
      if (object.touch.isDown()) {
         cs.key.virtualPress(38)
      }

      if (object.touch.isHeld()) {
         cs.draw.setAlpha(0.5)
      }

      cs.draw.fillRect(btnRect)
      cs.draw.setColor("white")
      cs.draw.strokeRect(btnRect)
   }
})
