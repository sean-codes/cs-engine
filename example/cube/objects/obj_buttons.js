cs.objects['obj_buttons'] = {
   surface: 'gui',
   
   create: function() {
      this.width = 30;
      this.height = 30;
      this.touch = cs.touch.observer()
   },

   step: function() {
      var btnRect = {
         x: cs.draw.surface.width - 50,
         y: cs.draw.surface.height - 50,
         width: this.width,
         height: this.height
      }

      this.touch.check(btnRect);
      if (this.touch.isDown()) {
         cs.key.virtualPress(38);
      }

      if (this.touch.isHeld()) {
         cs.draw.setAlpha(0.5);
      }

      cs.draw.fillRect(btnRect)
      cs.draw.setColor("white")
      cs.draw.strokeRect(btnRect)
   }
}
