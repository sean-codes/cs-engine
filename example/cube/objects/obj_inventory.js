cs.objects['obj_inventory'] = {
	create: function(){1
	   this.width = 32;
	   this.height = 32;
	   this.core.surface = 'gui';
		this.slots = [];
		for(var i = 0; i < 12; i++){
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
	step: function(){
		if(cs.key.up[73]){
			if(this.show){
				this.show = false;
				cs.global.showJoyStick = true;
			} else {
				this.show = true;
				cs.global.showJoyStick = false;
			}
		}

		if(!this.show){
			//Draw open button
			var openSize = 20;
			var openRect = {
				x: cs.draw.canvas.width-10-openSize,
				y: 10,
				size: openSize
			}

			cs.draw.fillRect(openRect);
			cs.draw.setColor("#FFF");
			cs.draw.strokeRect(openRect);
			cs.draw.setColor("#FFF");
			cs.draw.setTextCenter();
			cs.draw.text({
				x: openRect.x+(openRect.size/2),
				y: openRect.y+(openSize/2),
				text: 'i'
			})
         this.core.touch.check(openRect)
			if(this.core.touch.down){
				this.show = true;
				cs.global.showJoyStick = false;
			}
		} else {
         this.core.touch.check({ x:0, y:0, width:cs.draw.canvas.width, height:cs.draw.canvas.height })

    		var slotCount = this.slots.length;
    		var colCount = 3;
    		var rowCount = slotCount/colCount;

    		var space = 10;//Space between slots and border
    		var inventHeight = (rowCount * this.width) + ((rowCount+1)*space);
			var inventRect = {
				x: 20,
				y: (cs.draw.canvas.height - inventHeight)/2,
				width: (colCount * this.width) + ((colCount+1)*space),
				height: (rowCount * this.width) + ((rowCount+1)*space)
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

    		var img = ''; var himg = ''; var hx = 0; var hy = 0


    		if(this.core.touch.down){
    			console.log('why? x: ' + this.core.touch.x + ' y: ' + this.core.touch.y );
    		}
    		for(var i = 1; i <= slotCount; i++){
    			var slot = i-1;
    			img = 'spr_inventory';
    			if(this.slots[slot].length){
    				img = 'spr_item_' + this.slots[slot];
    			}
    			cs.draw.sprite({ spr:img, x:slotRect.x, y:slotRect.y });
    			//blah blah blah
    			if(this.slotDown == -1){
    				if(this.core.touch.down && this.core.touch.within(slotRect)){
    					console.log('Slot Down: ' + slot);
    					if(this.slots[slot] !== ''){
    						this.core.touch.off_x = this.core.touch.off_x-slotRect.x;
    						this.core.touch.off_y = this.core.touch.off_y-slotRect.y
    						this.slotDown = slot;
    					}
    				}
    			} else {
    				//Check slot over
    				if(this.core.touch.x < inventRect.x || this.core.touch.x > inventRect.x+inventRect.width ||
    				  	this.core.touch.y < inventRect.y || this.core.touch.y > inventRect.y+this.inventHeight){
    					this.slotOver = -1;
    				} else {
    					if(this.core.touch.x > slotRect.x && this.core.touch.x < slotRect.x + this.width &&
    						this.core.touch.y > slotRect.y && this.core.touch.y < slotRect.y + this.height){
    						this.slotOver = slot;
    					}
    				}

    				if(this.core.touch.up){
    					if(this.slotOver !== -1){
    						var save = this.slots[this.slotDown];
    						this.slots[this.slotDown] = this.slots[this.slotOver];
    						this.slots[this.slotOver] = save;
    					}
    					this.slotDown = -1;
    					console.log("Slot Up: " + this.slotOver);
    				}

    				if(this.slotDown == slot && this.core.touch.held){
    					hx = this.core.touch.x-this.core.touch.off_x;
    					hy = this.core.touch.y-this.core.touch.off_y;
    					himg = img;
    				}
    			}
    			slotRect.y += space + this.height;
    			if(i % 4 === 0){
    				slotRect.x += space + this.width;
    				slotRect.y = inventRect.y + space;
    			}
    		}

    		//Draw slot held
    		if(this.slotDown >= 0 && himg !== ''){
    			cs.draw.sprite({spr:himg, x:hx, y:hy});
    			cs.draw.setColor('#6695e2');
    			cs.draw.strokeRect({ x:hx, y:hy, width:this.width, height:this.height });
    		}

    		//Draw Close Button
			var closeRect = {
				x: inventRect.x-space,
				y: inventRect.y-space,
				size: space*2
			}

    		if(this.core.touch.down && this.core.touch.within(closeRect)){
    			this.show = false;
    			cs.global.showJoyStick = true;
    		}

    		cs.draw.fillRect(closeRect);
    		cs.draw.setColor("#FFF");
    		cs.draw.strokeRect(closeRect);
    		cs.draw.setColor("#FFF");
    		cs.draw.setTextCenter();
    		cs.draw.text({
				x:closeRect.x+(closeRect.size/2),
				y:closeRect.y+(closeRect.size/2),
				text:'X'
			});
      }
	}
}
