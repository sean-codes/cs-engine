cs.objects['obj_player'] = {
   zIndex: 10,
   create: ({ object, cs }) => {
      object.mask = { x: 0, y: 0, width: 8, height: 15 }
      object.hspeed = 0;
      object.vspeed = 0;
      object.dir = -1;
      object.speed = 2;
      object.gravity = 5;
      object.jump = 10;

      object.bounce = 0;
      object.bounceTimer = 20;

      object.attacking = 0;
      object.attackTimer = {
         load: 5,
         loadHold: 1,
         swing: 10,
         swingHold: 10,
         reload: 5
      }
      object.attackTotal = 0;
      for (var i in object.attackTimer)
         object.attackTotal += object.attackTimer[i]
   },
   
   draw: ({ object, cs }) => {
      cs.camera.follow({ x: object.x + object.mask.width / 2, y: object.y + object.mask.height / 2 });
      //Vertical Collisions
      var keys = {
         left: cs.inputKeyboard.held(37),
         right: cs.inputKeyboard.held(39),
         up: cs.inputKeyboard.held(38),
         down: cs.inputKeyboard.held(40),
         space: cs.inputKeyboard.held(32)
      }

      //Horizontal Movement
      if (keys.left) {
         if (object.hspeed > -object.speed) { object.dir = -1;
            object.hspeed -= 0.25 }
      } else if (keys.right) {
         if (object.hspeed < object.speed) { object.dir = 1;
            object.hspeed += 0.25 }
      } else {
         if (object.hspeed !== 0) {
            var sign = cs.math.sign(object.hspeed);
            object.hspeed -= sign / 4;
         }
      }

      object.h_col = cs.scripts.collide.obj(object, 'obj_block')
      if (object.h_col || (object.x + object.hspeed) <= 0 || (object.x + object.hspeed) + object.width >= cs.room.width) {
         object.hspeed = 0;
      }
      object.x += object.hspeed;

      //Vertical Movement
      if (object.vspeed < object.gravity)
         object.vspeed += 1;

      object.y += object.vspeed;
      object.v_col = cs.scripts.collide.obj(object, 'obj_block')

      if (object.v_col) {
         object.y -= object.vspeed;
         object.vspeed = 0;
      }

      //console.log(object.v_col)
      //Check if jumping
      if (keys.up && object.v_col && object.v_col.y > object.y)
         object.vspeed = -object.jump
      //Drawing
      object.bounceTimer -= 1;
      if (object.bounceTimer == 0) {
         object.bounceTimer = 20;
         if (object.bounce >= 0) {
            object.bounce = -1;
         } else {
            object.bounce = 1;
         }
         if (object.hspeed == 0) {
            object.bounce = 0;
         }
      }

      //Attacking
      if (keys.space && object.attacking == 0)
         object.attacking = object.attackTotal

      var attackAngle = 0;
      var attackX = 0;
      var attackY = 0;
      var state = '';
      if (object.attacking > 0) {
         object.attacking -= 1;
         var curAttack = object.attackTotal - object.attacking;
         var add = 0;
         for (state in object.attackTimer) {
            if (curAttack >= add && curAttack < add + object.attackTimer[state]) {
               var percent = (curAttack - add) / object.attackTimer[state];
               switch (state) {
                  case 'load':
                     attackAngle = percent * 45;
                     attackX = percent * 2;
                     break;
                  case 'loadHold':
                     attackAngle = 45;
                     attackX = 2;
                     break;
                  case 'swing':
                     attackAngle = 45 + percent * -135;
                     attackX = 2 - (percent * 2);
                     break;
                  case 'swingHold':
                     attackAngle = -90;
                     attackX = 0;
                     break;
                  case 'reload':
                     attackAngle = -90 + (90 * percent);
                     attackX = 0;
                     break;
               }
               break;
            }
            add += object.attackTimer[state];
         }
      }

      if (object.dir > 0) {
         //Going Right
         cs.draw.sprite({ spr: 'spr_sword', x: object.x + 9 + object.bounce - attackX, y: object.y + 10, angle: -attackAngle })
         cs.draw.sprite({ spr: 'spr_head', x: object.x, y: object.y })
         cs.draw.sprite({ spr: 'spr_foot', x: object.x + 1, y: object.y + 13 + object.bounce })
         cs.draw.sprite({ spr: 'spr_foot', x: object.x + 6, y: object.y + 13 - object.bounce })
         cs.draw.sprite({ spr: 'spr_hand', x: object.x - 1, y: object.y + 9 })
         cs.draw.sprite({ spr: 'spr_hand', x: object.x + 7 + object.bounce - attackX, y: object.y + 9 })
         cs.draw.sprite({ spr: 'spr_body', x: object.x + 1, y: object.y + 7 })
         cs.draw.sprite({ spr: 'spr_shield', x: object.x - 4 - object.bounce, y: object.y + 8 })
      } else {
         //Going Left
         cs.draw.sprite({ spr: 'spr_sword', x: object.x - 1 - object.bounce + attackX, y: object.y + 10, angle: attackAngle })
         cs.draw.sprite({ spr: 'spr_head', x: object.x + 9, y: object.y, scaleX: -1 })
         cs.draw.sprite({ spr: 'spr_foot', x: object.x + 1, y: object.y + 13 + object.bounce })
         cs.draw.sprite({ spr: 'spr_foot', x: object.x + 6, y: object.y + 13 - object.bounce })
         cs.draw.sprite({ spr: 'spr_hand', x: object.x - 1 - object.bounce + attackX, y: object.y + 9 })
         cs.draw.sprite({ spr: 'spr_hand', x: object.x + 7 - object.bounce, y: object.y + 9 })
         cs.draw.sprite({ spr: 'spr_body', x: object.x + 1, y: object.y + 7 })
         cs.draw.sprite({ spr: 'spr_shield', x: object.x + 4 + object.bounce, y: object.y + 8 })
      }

      if (cs.inputKeyboard.down[33]) { cs.camera.zoomIn(); }
      if (cs.inputKeyboard.down[34]) { cs.camera.zoomOut(); }
   }
}
