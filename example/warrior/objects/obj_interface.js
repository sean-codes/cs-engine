cs.objects['obj_interface'] = {
   create: ({ object, cs }) => {
      cs.object.create({ type: 'obj_joystick', x: 0, y: 0 })
      cs.object.create({ type: 'obj_buttons', x: 0, y: 0 })
   }
}

cs.objects['obj_buttons'] = {
   create: ({ object, cs }) => {
      object.touch = cs.inputTouch.observer()
      object.width = 30;
      object.height = 30;
      object.core.surface = 'gui';
      object.cx = 0;
      object.cy = 0;
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
         //console.log('open');
         cs.inputKeyboard.virtualPress(32);
      }

      if (object.touch.isHeld()) cs.draw.setAlpha(0.5)
      cs.draw.fillRect(btnRect);
      cs.draw.setColor("white");
   }
}

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
   },

   draw: ({ object, cs }) => {
      object.x = 10;
      object.y = cs.draw.surface.height - object.height - 10;
      object.touch.check({ x: object.x, y: object.y, width: object.width, height: object.height });

      object.tx = object.x + (object.width / 2) - (object.jw / 2);
      object.ty = object.y + (object.width / 2) - (object.jh / 2);

      if (object.touch.isHeld()) {
         object.tx = object.touch.x - (object.jw / 2);
         if (object.tx < object.x) {
            object.tx = object.x;
            //left key
            cs.inputKeyboard.virtualDown(37);
         } else { cs.inputKeyboard.virtualUp(37) }
         if (object.tx + object.jw > object.x + object.width) {
            object.tx = object.x + object.width - object.jw;
            //right key
            cs.inputKeyboard.virtualDown(39);
         } else { cs.inputKeyboard.virtualUp(39) }
         object.ty = object.touch.y - (object.jh / 2);
         if (object.ty < object.y) {
            object.ty = object.y;
            //up key
            cs.inputKeyboard.virtualDown(38);
         } else { cs.inputKeyboard.virtualUp(38); }
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
      cs.draw.setColor('#000000')
      cs.draw.fillRect({ x: object.x, y: object.y, width: object.width, height: object.height });
      cs.draw.setColor('#fff');
      cs.draw.strokeRect({ x: object.tx, y: object.ty, width: object.jw, height: object.jh });

      cs.draw.setColor('#fff');
      cs.draw.text({ x: 1, y: 0, text: 'FPS Step: ' + cs.fps.rate });

      cs.draw.setColor('#fff');
      cs.draw.text({ x: 1, y: 20, text: 'Scale: ' + cs.camera.scale });


      //cs.draw.fillRect({ x: 0, y: cs.draw.surface.height-this.height, width: 50, height: 50})
   }
}
