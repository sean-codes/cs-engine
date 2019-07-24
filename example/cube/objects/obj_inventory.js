cs.object.templates['obj_inventory'] = {
   create: function() {
      this.touch = cs.inputTouch.observer()
      this.width = 32;
      this.height = 32;
      this.core.surface = 'gui';
      this.slots = [];
      for (var i = 0; i < 12; i++) {
         this.slots[i] = '';
      }
      this.mainhand = [];
      this.mainhand[1] = '';
      this.mainhand[2] = '';

      this.offhand = [];
      this.offhand[1] = '';
      this.offhand[2] = '';

      this.armor = '';
      this.trinket = '';

      this.slots[0] = 'rupee';
      this.slots[2] = 'rupee';

      this.slotDown = -1;
      this.slotUp = -1;
      this.slotOver = -1;
      this.show = false;
   },
   step: function() {
      if (cs.key.up[73]) {
         if (this.show) {
            this.show = false;
            cs.global.showJoyStick = true;
         } else {
            this.show = true;
            cs.global.showJoyStick = false;
         }
      }

      if (!this.show) {
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
         this.touch.check(openRect)
         if (this.touch.isDown()) {
            this.show = true;
            cs.global.showJoyStick = false;
         }
      } else {
         this.touch.check({ x: 0, y: 0, width: cs.draw.surface.width, height: cs.draw.surface.height })

         var slotCount = this.slots.length;
         var colCount = 3;
         var rowCount = slotCount / colCount;

         var space = 10; //Space between slots and border
         var inventHeight = (rowCount * this.width) + ((rowCount + 1) * space);
         var inventRect = {
            x: 20,
            y: (cs.draw.surface.height - inventHeight) / 2,
            width: (colCount * this.width) + ((colCount + 1) * space),
            height: (rowCount * this.width) + ((rowCount + 1) * space)
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


         if (this.touch.isDown()) {
            console.log('why? x: ' + this.touch.x + ' y: ' + this.touch.y);
         }
         for (var i = 1; i <= slotCount; i++) {
            var slot = i - 1;
            img = 'spr_inventory';
            if (this.slots[slot].length) {
               img = 'spr_item_' + this.slots[slot];
            }
            cs.draw.sprite({ spr: img, x: slotRect.x, y: slotRect.y });
            //blah blah blah
            if (this.slotDown == -1) {
               if (this.touch.isDown() && this.touch.isWithin(slotRect)) {
                  console.log('Slot Down: ' + slot);
                  if (this.slots[slot] !== '') {
                     this.touch.offsetX = this.touch.offsetX - slotRect.x;
                     this.touch.offsetY = this.touch.offsetY - slotRect.y
                     this.slotDown = slot;
                  }
               }
            } else {
               //Check slot over
               if (this.touch.x < inventRect.x || this.touch.x > inventRect.x + inventRect.width ||
                  this.touch.y < inventRect.y || this.touch.y > inventRect.y + this.inventHeight) {
                  this.slotOver = -1;
               } else {
                  if (this.touch.x > slotRect.x && this.touch.x < slotRect.x + this.width &&
                     this.touch.y > slotRect.y && this.touch.y < slotRect.y + this.height) {
                     this.slotOver = slot;
                  }
               }

               if (this.touch.isUp()) {
                  if (this.slotOver !== -1) {
                     var save = this.slots[this.slotDown];
                     this.slots[this.slotDown] = this.slots[this.slotOver];
                     this.slots[this.slotOver] = save;
                  }
                  this.slotDown = -1;
                  console.log("Slot Up: " + this.slotOver);
               }

               if (this.slotDown == slot && this.touch.isHeld()) {
                  hx = this.touch.x - this.touch.offsetX;
                  hy = this.touch.y - this.touch.offsetY;
                  himg = img;
               }
            }
            slotRect.y += space + this.height;
            if (i % 4 === 0) {
               slotRect.x += space + this.width;
               slotRect.y = inventRect.y + space;
            }
         }

         //Draw slot held
         if (this.slotDown >= 0 && himg !== '') {
            cs.draw.sprite({ spr: himg, x: hx, y: hy });
            cs.draw.setColor('#6695e2');
            cs.draw.strokeRect({ x: hx, y: hy, width: this.width, height: this.height });
         }

         //Draw Close Button
         var closeRect = {
            x: inventRect.x - space,
            y: inventRect.y - space,
            size: space * 2
         }

         if (this.touch.isDown() && this.touch.isWithin(closeRect)) {
            this.show = false;
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
