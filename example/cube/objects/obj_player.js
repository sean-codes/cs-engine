cs.objects['obj_player'] = {

   create: ({ object, cs }) => {
      object.mask = { x: 0, y: 0, width: 16, height: 16 }
      object.gravity = 7;
      object.vspeed = 0;
      object.hspeed = 0;
      object.jump = 10;
      object.speed = 4;
      object.dir = 0;
      object.v_col = -1;
      object.h_col = -1;
      object.touch = cs.inputTouch.observer();
      object.old_keys = {
         left: true,
         right: true,
         up: true,
         down: true
      }
   },

   draw: function({ object, cs }) {
      cs.camera.follow({
         x: object.x + object.mask.width / 2,
         y: object.y + object.mask.height / 2
      })

      var keys = {
         left: cs.inputKeyboard.held(37),
         right: cs.inputKeyboard.held(39),
         up: cs.inputKeyboard.held(38),
         down: cs.inputKeyboard.held(40)
      }

      //Horizontal Movement
      if (keys.left) {
         if (object.hspeed > -object.speed) { object.dir = 1;
            object.hspeed -= 0.25 }
      } else if (keys.right) {
         if (object.hspeed < object.speed) { object.dir = 0;
            object.hspeed += 0.25 }
      } else {
         if (object.hspeed !== 0) {
            var sign = cs.math.sign(object.hspeed);
            object.hspeed -= sign / 4;
         }
      }

      object.h_col = cs.script.collide(object, 'obj_block', { vspeed: 0 })
      if (
         object.h_col ||
         (object.x + object.hspeed) <= 0 ||
         object.x + object.hspeed + object.mask.width >= cs.room.width
      ) {
         object.hspeed = 0;
      }
      object.x += object.hspeed;

      //Vertical Movement
      if (object.vspeed < object.gravity) {
         object.vspeed += 1;
      }
      object.v_col = cs.script.collide(object, 'obj_block')

      if (object.v_col) {
         object.vspeed = 0;
         if (keys.up && object.v_col.y > object.y) {
            object.vspeed = -object.jump;
         }
      }
      object.y += object.vspeed;


      cs.draw.sprite({ spr: 'spr_player', x: object.x, y: object.y, frame: object.dir })
   }
}
