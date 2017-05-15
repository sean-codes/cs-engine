cs.objects['obj_inventory'] = {
	create: function(){1
	    this.width = 32;
	    this.height = 32;
	    this.draw = 'gui';
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
			var openX = cs.draw.width-10-openSize;
			var openY = 10;

			cs.draw.rect(openX, openY, openSize, openSize, true);
			cs.draw.setColor("#FFF");
			cs.draw.rect(openX, openY, openSize, openSize, false);
			cs.draw.setColor("#FFF");
			cs.draw.setTextCenter();
			cs.draw.text(openX+(openSize/2), openY+(openSize/2), 'i');
            this.touch.check(openX, openY, openSize, openSize)
			if(this.touch.down){
				this.show = true;
				cs.global.showJoyStick = false;
			}
		} else {
            this.touch.check(0, 0, cs.draw.width, cs.draw.height);

    		var slotCount = this.slots.length;
    		var colCount = 3;
    		var rowCount = slotCount/colCount;

    		var space = 10;//Space between slots and border
    		var inventWidth = (colCount * this.width) + ((colCount+1)*space);
    		var inventHeight = (rowCount * this.width) + ((rowCount+1)*space);
    		var topPadding = (cs.draw.height - inventHeight)/2;
    		var leftPadding = 20;

    		//Draw Border
    		cs.draw.setAlpha(0.8);
    		//cs.draw.rect(0, 0, cs.draw.width, cs.draw.height, true);
    		cs.draw.setAlpha(0.5);
    		cs.draw.setColor("#000");
    		cs.draw.rect(leftPadding, topPadding, inventWidth, inventHeight, true);
    		cs.draw.setColor("#FFF");
    		cs.draw.rect(leftPadding, topPadding, inventWidth, inventHeight, false);
    		var cx = leftPadding + space;
    		var cy = topPadding + space;

    		var img = ''; var himg = ''; var hx = 0; var hy = 0;


    		if(this.touch.down){
    			console.log('why?');
    		}
    		for(var i = 1; i <= slotCount; i++){
    			var slot = i-1;
    			img = 'spr_inventory';
    			if(this.slots[slot].length){
    				img = 'spr_item_' + this.slots[slot];
    			}
    			cs.draw.sprite(img, cx, cy);
    			//blah blah blah
    			if(this.slotDown == -1){
    				if(this.touch.down && this.touch.inside(cx, cy, this.width, this.height)){
    					console.log('Slot Down: ' + slot);
    					if(this.slots[slot] !== ''){
    						this.touch.off_x = this.touch.off_x-cx;
    						this.touch.off_y = this.touch.off_y-cy
    						this.slotDown = slot;
    					}
    				}
    			} else {
    				//Check slot over
    				if(this.touch.x < leftPadding || this.touch.x > leftPadding+inventWidth ||
    				  	this.touch.y < topPadding || this.touch.y > topPadding+this.inventHeight){
    					this.slotOver = -1;
    				} else {
    					if(this.touch.x > cx && this.touch.x < cx + this.width &&
    						this.touch.y > cy && this.touch.y < cy + this.height){
    						this.slotOver = slot;
    					}
    				}

    				if(this.touch.up){
    					if(this.slotOver !== -1){
    						var save = this.slots[this.slotDown];
    						this.slots[this.slotDown] = this.slots[this.slotOver];
    						this.slots[this.slotOver] = save;
    					}
    					this.slotDown = -1;
    					console.log("Slot Up: " + this.slotOver);
    				}

    				if(this.slotDown == slot && this.touch.held){
    					hx = this.touch.x-this.touch.off_x;
    					hy = this.touch.y-this.touch.off_y;
    					himg = img;
    				}
    			}
    			cy += space + this.height;
    			if(i % 4 === 0){
    				cx += space + this.width;
    				cy = topPadding + space;
    			}
    		}

    		//Draw slot held
    		if(this.slotDown >= 0 && himg !== ''){
    			cs.draw.sprite(himg, hx, hy);
    			cs.draw.setColor('#6695e2');
    			cs.draw.rect(hx, hy, this.width, this.height, false);
    		}

    		//Draw Close Button
    		var closeX = leftPadding-space;
    		var closeY = topPadding-space;
    		var closeSize = space*2;

    		if(this.touch.down && this.touch.inside(closeX, closeY, closeSize, closeSize)){
    			this.show = false;
    			cs.global.showJoyStick = true;
    		}
    		cs.draw.rect(closeX, closeY, closeSize, closeSize, true);
    		cs.draw.setColor("#FFF");
    		cs.draw.rect(closeX, closeY, closeSize, closeSize, false);
    		cs.draw.setColor("#FFF");
    		cs.draw.setTextCenter();
    		cs.draw.text(closeX+(closeSize/2), closeY+(closeSize/2), 'X');
        }
	}
}
