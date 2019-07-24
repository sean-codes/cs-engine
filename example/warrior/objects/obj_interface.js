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

   draw: function({ object, cs }) => {
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
      this.touch = cs.inputTouch.observer()
      this.width = 64;
      this.height = 64;
      this.core.surface = 'gui';
      this.tx = 0;
      this.ty = 0;
      this.jw = this.width / 2;
      this.jh = this.height / 2;
   },
   
   draw: ({ object, cs }) => {
      this.x = 10;
      this.y = cs.draw.surface.height - this.height - 10;
      this.touch.check({ x: this.x, y: this.y, width: this.width, height: this.height });

      this.tx = this.x + (this.width / 2) - (this.jw / 2);
      this.ty = this.y + (this.width / 2) - (this.jh / 2);

      if (this.touch.isHeld()) {
         this.tx = this.touch.x - (this.jw / 2);
         if (this.tx < this.x) {
            this.tx = this.x;
            //left key
            cs.inputKeyboard.virtualDown(37);
         } else { cs.inputKeyboard.virtualUp(37) }
         if (this.tx + this.jw > this.x + this.width) {
            this.tx = this.x + this.width - this.jw;
            //right key
            cs.inputKeyboard.virtualDown(39);
         } else { cs.inputKeyboard.virtualUp(39) }
         this.ty = this.touch.y - (this.jh / 2);
         if (this.ty < this.y) {
            this.ty = this.y;
            //up key
            cs.inputKeyboard.virtualDown(38);
         } else { cs.inputKeyboard.virtualUp(38); }
         if (this.ty + this.jw > this.y + this.height) {
            this.ty = this.y + this.height - this.jh;
         }
      } else {
         if (this.touch.isUp()) {
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
      cs.draw.fillRect({ x: this.x, y: this.y, width: this.width, height: this.height });
      cs.draw.setColor('#fff');
      cs.draw.strokeRect({ x: this.tx, y: this.ty, width: this.jw, height: this.jh });

      cs.draw.setColor('#fff');
      cs.draw.text({ x: 1, y: 0, text: 'FPS Step: ' + cs.fps.rate });

      cs.draw.setColor('#fff');
      cs.draw.text({ x: 1, y: 20, text: 'Scale: ' + cs.camera.scale });


      //cs.draw.fillRect({ x: 0, y: cs.draw.surface.height-this.height, width: 50, height: 50})
   }
}
