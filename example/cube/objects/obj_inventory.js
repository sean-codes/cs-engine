cs.objects['obj_inventory'] = {

   create: ({ object, cs }) => {
      object.touch = cs.inputTouch.observer()
      object.width = 32;
      object.height = 32;
      object.core.surface = 'gui';
      object.slots = [];
      for (var i = 0; i < 12; i++) {
         object.slots[i] = '';
      }
      object.mainhand = [];
      object.mainhand[1] = '';
      object.mainhand[2] = '';

      object.offhand = [];
      object.offhand[1] = '';
      object.offhand[2] = '';

      object.armor = '';
      object.trinket = '';

      object.slots[0] = 'rupee';
      object.slots[2] = 'rupee';

      object.slotDown = -1;
      object.slotUp = -1;
      object.slotOver = -1;
      object.show = false;
   },

   draw: ({ object, cs }) => {
      if (cs.inputKeyboard.up[73]) {
         if (object.show) {
            object.show = false;
            cs.global.showJoyStick = true;
         } else {
            object.show = true;
            cs.global.showJoyStick = false;
         }
      }

      if (!object.show) {
         //Draw open button
         var openSize = 40;
         var openRect = {
            x: cs.draw.surface.width - 10 - openSize,
            y: 10,
            size: openSize
         }

         cs.draw.fillRect(openRect);
         cs.draw.setColor("#FFF");
         cs.draw.strokeRect(openRect);
         cs.draw.setColor("#FFF");
         cs.draw.setTextCenter();
         cs.draw.text({
            x: openRect.x + (openRect.size / 2),
            y: openRect.y + (openSize / 2),
            text: 'i'
         })
         object.touch.check(openRect)
         if (object.touch.isDown()) {
            object.show = true;
            cs.global.showJoyStick = false;
         }
      } else {
         object.touch.check({ x: 0, y: 0, width: cs.draw.surface.width, height: cs.draw.surface.height })

         var slotCount = object.slots.length;
         var colCount = 3;
         var rowCount = slotCount / colCount;

         var space = 10; //Space between slots and border
         var inventHeight = (rowCount * object.width) + ((rowCount + 1) * space);
         var inventRect = {
            x: 20,
            y: (cs.draw.surface.height - inventHeight) / 2,
            width: (colCount * object.width) + ((colCount + 1) * space),
            height: (rowCount * object.width) + ((rowCount + 1) * space)
         }
         //Draw Border
         cs.draw.setAlpha(0.8);
         //cs.draw.rect(0, 0, cs.draw.width, cs.draw.height, true);
         cs.draw.setAlpha(0.5);
         cs.draw.setColor("#000");
         cs.draw.fillRect(inventRect)
         cs.draw.setColor("#FFF")
         cs.draw.strokeRect(inventRect)
         slotRect = {
            x: inventRect.x + space,
            y: inventRect.y + space,
            size: 32
         }

         var img = '';
         var himg = '';
         var hx = 0;
         var hy = 0


         if (object.touch.isDown()) {
            console.log('why? x: ' + object.touch.x + ' y: ' + object.touch.y);
         }
         for (var i = 1; i <= slotCount; i++) {
            var slot = i - 1;
            img = 'spr_inventory';
            if (object.slots[slot].length) {
               img = 'spr_item_' + object.slots[slot];
            }
            cs.draw.sprite({ spr: img, x: slotRect.x, y: slotRect.y });
            //blah blah blah
            if (object.slotDown == -1) {
               if (object.touch.isDown() && object.touch.isWithin(slotRect)) {
                  console.log('Slot Down: ' + slot);
                  if (object.slots[slot] !== '') {
                     object.touch.offsetX = object.touch.offsetX - slotRect.x;
                     object.touch.offsetY = object.touch.offsetY - slotRect.y
                     object.slotDown = slot;
                  }
               }
            } else {
               //Check slot over
               if (object.touch.x < inventRect.x || object.touch.x > inventRect.x + inventRect.width ||
                  object.touch.y < inventRect.y || object.touch.y > inventRect.y + object.inventHeight) {
                  object.slotOver = -1;
               } else {
                  if (object.touch.x > slotRect.x && object.touch.x < slotRect.x + object.width &&
                     object.touch.y > slotRect.y && object.touch.y < slotRect.y + object.height) {
                     object.slotOver = slot;
                  }
               }

               if (object.touch.isUp()) {
                  if (object.slotOver !== -1) {
                     var save = object.slots[object.slotDown];
                     object.slots[object.slotDown] = object.slots[object.slotOver];
                     object.slots[object.slotOver] = save;
                  }
                  object.slotDown = -1;
                  console.log("Slot Up: " + object.slotOver);
               }

               if (object.slotDown == slot && object.touch.isHeld()) {
                  hx = object.touch.x - object.touch.offsetX;
                  hy = object.touch.y - object.touch.offsetY;
                  himg = img;
               }
            }
            slotRect.y += space + object.height;
            if (i % 4 === 0) {
               slotRect.x += space + object.width;
               slotRect.y = inventRect.y + space;
            }
         }

         //Draw slot held
         if (object.slotDown >= 0 && himg !== '') {
            cs.draw.sprite({ spr: himg, x: hx, y: hy });
            cs.draw.setColor('#6695e2');
            cs.draw.strokeRect({ x: hx, y: hy, width: object.width, height: object.height });
         }

         //Draw Close Button
         var closeRect = {
            x: inventRect.x - space,
            y: inventRect.y - space,
            size: space * 2
         }

         if (object.touch.isDown() && object.touch.isWithin(closeRect)) {
            object.show = false;
            cs.global.showJoyStick = true;
         }

         cs.draw.fillRect(closeRect);
         cs.draw.setColor("#FFF");
         cs.draw.strokeRect(closeRect);
         cs.draw.setColor("#FFF");
         cs.draw.setTextCenter();
         cs.draw.text({
            x: closeRect.x + (closeRect.size / 2),
            y: closeRect.y + (closeRect.size / 2),
            text: 'X'
         });
      }
   }
}
