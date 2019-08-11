cs.objects['obj_buttons'] = {

   create: ({ object, cs, attr }) => {
      object.width = 30;
      object.height = 30;
      object.touch = cs.inputTouch.observer()
   },

   draw: ({ object, cs }) => {
      var btnRect = {
         x: cs.draw.surface.width - 50,
         y: cs.draw.surface.height - 50,
         width: object.width,
         height: object.height
      }

      object.touch.check(btnRect);
      if (object.touch.isDown()) {
         cs.inputKeyboard.virtualPress(38)
      }

      if (object.touch.isHeld()) {
         cs.draw.setAlpha(0.5)
      }

      cs.draw.fillRect(btnRect)
      cs.draw.setColor("white")
      cs.draw.strokeRect(btnRect)
   }
}
