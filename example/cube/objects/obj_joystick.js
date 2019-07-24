cs.objects['obj_joystick'] = {
   create: ({ object, cs }) => {
      object.touch = cs.inputTouch.observer()
      object.width = 64;
      object.height = 64;
      object.core.surface = 'gui';
      object.tx = 0;
      object.ty = 0;
      object.jw = object.width / 2;
      object.jh = object.height / 2;
      cs.global.showJoyStick = true;
   },

   draw: ({ object, cs }) => {
      if (!cs.global.showJoyStick)
         return

      object.x = 10;
      object.y = cs.draw.surface.height - object.height - 10;

      object.touch.check({
         x: object.x,
         y: object.y,
         width: object.width,
         height: object.height
      });

      object.tx = object.x + (object.width / 2) - (object.jw / 2);
      object.ty = object.y + (object.width / 2) - (object.jh / 2);
      if (object.touch.isHeld()) {
         object.tx = object.touch.x - (object.jw / 2);
         if (object.tx < object.x) {
            object.tx = object.x;
            //left key
            cs.inputKeyboard.virtualDown(37);
         } else {
            cs.inputKeyboard.virtualUp(37)
         }
         if (object.tx + object.jw > object.x + object.width) {
            object.tx = object.x + object.width - object.jw;
            //right key
            cs.inputKeyboard.virtualDown(39);
         } else {
            cs.inputKeyboard.virtualUp(39)
         }
         object.ty = object.touch.y - (object.jh / 2);
         if (object.ty < object.y) {
            object.ty = object.y;
            //up key
            cs.inputKeyboard.virtualDown(38);
         } else {
            cs.inputKeyboard.virtualUp(38);
         }
         if (object.ty + object.jw > object.y + object.height) {
            object.ty = object.y + object.height - object.jh;
         }
      } else {
         if (object.touch.isUp()) {
            if (cs.inputKeyboard.held(37)) {
               cs.inputKeyboard.virtualUp(37);
            }
            if (cs.inputKeyboard.held(38)) {
               cs.inputKeyboard.virtualUp(38);
            }
            if (cs.inputKeyboard.held(39)) {
               cs.inputKeyboard.virtualUp(39);
            }
         }
      }

      cs.draw.setAlpha(0.25);
      cs.draw.fillRect({
         x: object.x,
         y: object.y,
         width: object.width,
         height: object.height
      });
      cs.draw.setColor('#fff');
      cs.draw.strokeRect({
         x: object.tx,
         y: object.ty,
         width: object.jw,
         height: object.jh
      });

      cs.draw.setColor('#FFF')
      cs.draw.text({
         x: 4,
         y: 4,
         text: 'FPS Step: ' + cs.fps.rate
      })
   }
}
