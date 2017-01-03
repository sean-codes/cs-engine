//Name Space
var cs = {};
//---------------------------------------------------------------------------------------------//
//-----------------------------| Global Variables and Scripts |--------------------------------//
//---------------------------------------------------------------------------------------------//
cs.global = {}
cs.script = {}
//---------------------------------------------------------------------------------------------//
//--------------------------------| Performance Monitoring |-----------------------------------//
//---------------------------------------------------------------------------------------------//
cs.fps = {
    rate : 0,
    frame : 0, 
    check : Date.now(),
    update : function(){
        if(Date.now() - this.check > 1000){
            this.check = Date.now();
            this.rate = this.frame;
            this.frame = 0; 
        } else {
            this.frame += 1;
        }
    },
}
//---------------------------------------------------------------------------------------------//
//----------------------------------| Global Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.init = function(canvasId){
    //Find/Set Up Canvas
    var view = document.getElementById(canvasId);
    view.tabIndex = 1000;
    var viewCanvas = document.createElement('canvas');
    view.appendChild(viewCanvas);
    cs.draw.view.canvas = viewCanvas;
    cs.draw.view.ctx = viewCanvas.getContext('2d');
    cs.draw.createLayer('gui');
    cs.draw.createLayer('game');
    cs.draw.ctx = cs.draw.game[0].ctx;
    
    //Initiate Inputs
    view.addEventListener('keydown', cs.key.updateDown);
    view.addEventListener('keyup', cs.key.updateUp);
    view.addEventListener('mousemove', cs.mouse.move);
    view.addEventListener('mousedown', cs.mouse.down);
    view.addEventListener('mouseup', cs.mouse.up);
    view.addEventListener("touchstart", cs.touch.down, false);
    view.addEventListener("touchend", cs.touch.up, false);
    view.addEventListener("touchcancel", cs.touch.up, false);
    view.addEventListener("touchmove", cs.touch.move, false);
    cs.input.create();
    //Camera/View Size
    cs.draw.resize();
    cs.input.resize();
    //Animation and Step Start
    window.requestAnimFrame = window.requestAnimationFrame || 
                              window.webkitRequestAnimationFrame ||
                              window.mozRequestAnimationFrame;
    cs.loop.step();
}
cs.loop = {
    step : function(){
        window.requestAnimFrame(cs.loop.step);
        cs.fps.update();
        
        cs.draw.clear();
        cs.key.execute();
        for(var i = 0; i <cs.obj.list.length; i++){
            if(cs.obj.list[i].live){
                var obj = cs.obj.list[i];
                cs.draw.setLayer(obj.draw, obj.layer);
                cs.particle.settings = obj.particle.settings;
                cs.particle.obj = obj;
                var step = cs.obj.types[obj.type].step;
                step.call(obj);
            }
        }
        cs.key.reset();   
        cs.touch.reset();
        
        //Resize Canvas
        var w = window.innerWidth; var h = window.innerHeight; var o = screen.orientation;
        if(w !== cs.draw.w || h !== cs.draw.h || o !== cs.draw.o){
            cs.draw.w = w;
            cs.draw.h = h;
            cs.draw.o = o;
            cs.input.resize();
            cs.draw.resize();
        }
        
        cs.draw.display(); 
    }
}
//---------------------------------------------------------------------------------------------//
//-----------------------------------| Object Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.obj = { 
    list : [],
    types : [],
    create : function(type, x, y){
        var obj_id = this.list.length;
    
        this.list[obj_id] = {};
        this.list[obj_id].live = true;
        this.list[obj_id].type = type;
        this.list[obj_id].id = obj_id;
        this.list[obj_id].core = false; 
        this.list[obj_id].draw = 'game';
        this.list[obj_id].layer = 0;
        this.list[obj_id].particle = { list : [], settings : {} };
        this.list[obj_id].x = x;
        this.list[obj_id].y = y; 
        var create = cs.obj.types[type].create;
        create.call(this.list[obj_id]);
        this.list[obj_id].touch = cs.touch.create(this.list[obj_id].draw == 'gui');
        return obj_id;
    },
    load : function(name, create, step, draw){
        var cnt = this.types.length;
        this.types[name] = {
            name : name,
            create : create,
            step : step, 
            draw : draw
        }
    },
    destroy : function(id){
        this.list[id].live = false;
    }
}
//---------------------------------------------------------------------------------------------//
//-----------------------------------| Sprite Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.sprite = {
    list : {},
    add : function(sprInfo, sprSource){
        //spr_block-1-16-16-0-0 
        sprInfo = sprInfo.split("-");
        cs.sprite.list[sprInfo[0]] = new Image();
        cs.sprite.list[sprInfo[0]].src = sprSource;
        cs.sprite.list[sprInfo[0]].frames = sprInfo[1];
        cs.sprite.list[sprInfo[0]].width = sprInfo[2];
        cs.sprite.list[sprInfo[0]].height = sprInfo[3];
        cs.sprite.list[sprInfo[0]].x_off = sprInfo[4];
        cs.sprite.list[sprInfo[0]].y_off = sprInfo[5];
    }
}
//---------------------------------------------------------------------------------------------//
//----------------------------------| Drawing Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.draw = {
    view : { ctx: undefined, canvas : undefined },
    game : [],//Game Canvases
    gui : [],//GUI Canvases
    ctx : undefined,
    canvas : undefined,
    alpha : 1,
    raw : false,
    height : 0,
    width : 0,
    fontSize : 12,
    w : 0,
    h : 0,
    o : 0,
    createLayer : function(type){
        var num = cs.draw[type].length;
        var newLayer = document.createElement("canvas");
        newLayer.style.display = "none";
        
        cs.draw[type][num] = {};
        cs.draw[type][num].canvas = newLayer;
        cs.draw[type][num].ctx = newLayer.getContext('2d');
        cs.draw[type][num].alpha = 1;
        document.body.appendChild(newLayer);
        cs.draw.resize();
        return num;
    },
    clear : function(){
        for(var i = 0; i < this.game.length; i++){
            this.game[i].ctx.clearRect(0, 0,
              cs.camera.width + (cs.camera.width*cs.camera.scale),
              cs.camera.height + (cs.camera.height*cs.camera.scale));
        }
        for(i = 0; i < this.gui.length; i++){
            this.gui[i].ctx.clearRect(0, 0, 
              cs.camera.width,
              cs.camera.height);
        }
        this.view.ctx.clearRect(0, 0, 
            this.view.canvas.width, 
            this.view.canvas.height); 
    },
    resize : function(){
        var w = window.innerWidth;
        var h = window.innerHeight;
        var ratioHeight = w/h; //How many h = w
        var ratioWidth = h/w;//how man w = a h

        var nw = cs.camera.maxWidth - (cs.camera.maxWidth%ratioWidth);
        var nh = nw * ratioWidth;
        if(nh > cs.camera.maxHeight){
            nh = cs.camera.maxHeight - (cs.camera.maxHeight%ratioHeight);
            nw = nh * ratioHeight;
        }
        
        cs.draw.view.canvas.style.width = w + 'px';
        cs.draw.view.canvas.style.height = h + 'px';
        
        cs.draw.view.canvas.width = nw;
        cs.draw.view.canvas.height = nh;
        cs.draw.view.ctx.imageSmoothingEnabled = false;
        cs.draw.view.ctx.webkitImageSmoothingEnabled = false;
        cs.draw.view.ctx.mozImageSmoothingEnabled = false;
        
        cs.camera.width = Math.ceil(nw);
        cs.camera.height = Math.ceil(nh);
        for(var i = 0; i < cs.draw.game.length; i++){
            cs.draw.game[i].canvas.width = nw;
            cs.draw.game[i].canvas.height = nh;   
            cs.draw.game[i].canvas.width = cs.draw.game[i].canvas.width;
            cs.draw.game[i].ctx.scale(1/cs.camera.scale, 1/cs.camera.scale);
            cs.draw.game[i].ctx.imageSmoothingEnabled = false;
            cs.draw.game[i].ctx.webkitImageSmoothingEnabled = false;
            cs.draw.game[i].ctx.mozImageSmoothingEnabled = false;
        }
        for(i = 0; i < cs.draw.gui.length; i++){
            cs.draw.gui[i].canvas.width = nw;
            cs.draw.gui[i].canvas.height = nh;
            cs.draw.gui[i].ctx.imageSmoothingEnabled = false;
            cs.draw.gui[i].ctx.webkitImageSmoothingEnabled = false;
            cs.draw.gui[i].ctx.mozImageSmoothingEnabled = false;
        }   
    },
    display : function(){
        for(var i = 0; i < this.game.length; i++){
            this.view.ctx.globalAlpha = this.game[i].alpha;
            this.view.ctx.drawImage(this.game[i].canvas, 0, 0);
        }
        for( i = 0; i < this.gui.length; i++){
            this.view.ctx.globalAlpha = this.gui[i].alpha;
            this.view.ctx.drawImage(this.gui[i].canvas, 0, 0);
        }
    },
    sprite : function(sprite, frame, x, y){
        sprite = cs.sprite.list[sprite];
        if(!this.raw){
            x = Math.floor(x - cs.camera.x);
            y = Math.floor(y - cs.camera.y);
            if(x > (cs.camera.x + cs.camera.width) && x < cs.camera.x-sprite.width)
                return;   
        }
        if(frame == -1) frame = (frames % sprite.frames);//Dear lord help me
        this.ctx.drawImage(sprite, (frame*sprite.width), 0, sprite.width,
          sprite.height, x, y, sprite.width, sprite.height);

        cs.draw.reset();
    },
    spriteExt : function(img, frame, x, y, angle){ 
        if(!this.raw){
            x = Math.floor(x - cs.camera.x);
            y = Math.floor(y - cs.camera.y);
        }
        
        //Draw the xoff/yoff
        this.ctx.setLineDash([2, 2]);  

        this.ctx.beginPath();
        this.ctx.moveTo(x-40,y);
        this.ctx.lineTo(x+40,y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x,y-40);
        this.ctx.lineTo(x,y+40);
        this.ctx.stroke();

        this.ctx.save(); 

        this.ctx.translate(x, y);
        this.ctx.rotate(angle * Math.PI/180);
        this.ctx.drawImage(img, -(img.x_off), -(img.y_off));

        this.ctx.restore(); 
        cs.draw.reset();
    },
    text : function(x, y, str){
        if(!this.raw){
            x = Math.floor(x - cs.camera.x);
            y = Math.floor(y - cs.camera.y);
        }
        this.ctx.fillText(str, x, y);
        cs.draw.reset();
    },
    line : function(x1, y1, x2, y2){
        var cx = 0.5; var cy = 0.5;
        if(!this.raw){
            cx =  Math.floor(cs.camera.x);
            cy =  Math.floor(cs.camera.y);
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x1-cx, y1-cy);
        this.ctx.lineTo(x2-cx, y2-cy);
        this.ctx.stroke();
        cs.draw.reset();
    },
    rect : function(x, y, w, h, fill){
        x = Math.floor(x); y = Math.floor(y);
        w = Math.floor(w); h = Math.floor(h);
        if(!this.raw){
            x =  Math.floor(x-cs.camera.x); 
            y =  Math.floor(y-cs.camera.y);
        }
        if(fill === true){ 
            this.ctx.fillRect(x,y,w,h);
        } else {
            x+=0.50;
            y+=0.50;
            w-=this.ctx.lineWidth;
            h-=this.ctx.lineWidth;
            this.ctx.strokeRect(x,y,w,h);
        }
        cs.draw.reset();
    },
    circle : function(x, y, rad){
        if(!this.raw){
            x =  x-cs.camera.x; 
            y =  y-cs.camera.y;
        }
        cs.draw.ctx.beginPath();
        cs.draw.ctx.arc(x, y, rad, 0, Math.PI*2, true); 
        cs.draw.ctx.closePath(); 
        cs.draw.ctx.fill();
        cs.draw.reset();
    },
    circleGradient : function(x, y, radius){
        if(!this.raw){
            x =  x-cs.camera.x; 
            y =  y-cs.camera.y;
        }
        //Draw a circle
        var g = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(1, 'transparent'); 
        g.addColorStop(0, 'black'); 
        this.ctx.fillStyle = g;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI*2, true); 
        this.ctx.closePath(); 
        //Fill
        this.ctx.fill();
        cs.draw.reset();
    },
    setColor: function(color){
      this.ctx.fillStyle = color;  
      this.ctx.strokeStyle = color;  
    },
    setAlpha : function(alpha){
        this.ctx.globalAlpha = alpha;
    },
    setWidth : function(width){
        this.ctx.lineWidth = width;  
    },
    setFont : function(font){
        this.ctx.font = font;  
    },
    setTextAlign : function(alignment){
        this.ctx.textAlign = alignment;
    },
    setTextBaseline : function(alignment){
        this.ctx.textBaseline=alignment;
    },
    setTextCenter : function(){
        this.setTextAlign('center');
        this.setTextBaseline('middle');
    },
    setOperation : function(operation){
        this.ctx.globalCompositeOperation = operation;
    },
    setLayer : function(target, num){
        this.target = this[target][num];
        this.ctx = this.target.ctx;
        this.canvas = this.target.canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.raw = false;//Use raw cordinates
        if(target == 'gui') { this.raw = true; }
    },
    setLayerAlpha : function(alpha){
        this.target.alpha = alpha;  
    },
    reset : function(){
        cs.draw.target.alpha = 1;
        cs.draw.setAlpha(1);
        cs.draw.setWidth(1);
        cs.draw.setFont(this.fontSize + "px Trebuchet MS");
        cs.draw.setTextAlign('start');
        cs.draw.setTextBaseline('top');
        cs.draw.setColor("#000");
        cs.draw.setOperation('source-over');
    }
}
//---------------------------------------------------------------------------------------------//
//-----------------------------| Particle Engine Functions |-----------------------------------//
//---------------------------------------------------------------------------------------------//
cs.particle = {
    settings : {},
    obj : {},
    burst : function(x, y, w, h, qty=0){
        var num = qty;
        if(num === 0){
            num = this.settings.particlesPerStep;
        } 
        if(num < 0){
            num = (Math.floor(Math.random() * Math.abs(num)) === 1)
        }
        for(var i = 0; i < num; i++){       
            var c1 = cs.particle.rgbFromHex(this.settings.colorEnd);
            var c2 = cs.particle.rgbFromHex(this.settings.colorStart);
            var life = cs.math.iRandomRange(this.settings.lifeMin, this.settings.lifeMax);
            var dir = cs.math.iRandomRange(this.settings.dirMin, this.settings.dirMax);
            var speed = cs.math.iRandomRange(this.settings.speedMin, this.settings.speedMax);
            var speedX = Math.cos(dir*Math.PI/180);
            var speedY = Math.sin(dir*Math.PI/180);
            var new_part = {
                shape      : this.settings.shape,
                c_r        : c1.r,
                c_g        : c1.g,
                c_b        : c1.b,
                c_sr       : (c2.r - c1.r) / life,
                c_sg       : (c2.g - c1.g) / life,
                c_sb       : (c2.b - c1.b) / life,
                alpha      : this.settings.alpha,
                fade       : this.settings.fade,
                size       : this.settings.size,
                grow       : this.settings.grow,
                speed      : speed/10,
                speedX     : speedX,
                speedY     : speedY,
                dir        : dir,
                accel      : this.settings.accel/10,
                accelRate  : this.settings.accel/100,
                gravity    : this.settings.gravity/10,
                gravityRate : this.settings.gravity/100,
                life       : life,
                x          : cs.math.iRandomRange(x, x+w),
                y          : cs.math.iRandomRange(y, y+h),
                wobbleX    : cs.math.iRandomRange(-this.settings.wobbleX, this.settings.wobbleX),
                wobbleSetX : this.settings.wobbleX,
                wobbleY    : cs.math.iRandomRange(-this.settings.wobbleY, this.settings.wobbleY),
                wobbleSetY : this.settings.wobbleY,
            }
            var len = this.obj.particle.list.length;
            this.obj.particle.list[len] = new_part;
        }
    },
    step : function(){
        var tempParticles = [];
        for(var i = 0; i < this.obj.particle.list.length; i++){
            var particle = this.obj.particle.list[i];
            particle.life -= 1;
            particle.size = particle.size + particle.grow/100;
            particle.alpha = particle.alpha - particle.fade/10;
            if(particle.life > 0 && particle.alpha > 0 && particle.size > 0){
                //Accelleration
                particle.accel += particle.accelRate;
                particle.gravity -= particle.gravityRate;
                
                //Wobble
                if(particle.wobbleSetX !== 0){
                    if(particle.wobbleX > 0){
                        particle.wobbleX -= 1; particle.x -= 1;
                        if(particle.wobbleX === 0){particle.wobbleX = -particle.wobbleSetX;}
                    } else {
                        particle.wobbleX += 1; particle.x += 1;
                        if(particle.wobbleX === 0){particle.wobbleX = particle.wobbleSetX;}
                    }
                }
                if(particle.wobbleSetY !== 0){
                    if(particle.wobbleY > 0){
                        particle.wobbleY -= 1; particle.y -= 4;
                        if(particle.wobbleY === 0){particle.wobbleY = -particle.wobbleSetY;}
                    } else {
                        particle.wobbleY += 1; particle.y += 4;
                        if(particle.wobbleY === 0){particle.wobbleY = particle.wobbleSetY;}
                    }
                }
                
                //Position Particle?
                var speed = particle.speed + particle.accel
                particle.x += particle.speedX*speed;
                particle.y += particle.speedY*(speed+particle.gravity);

                //Draw Particle
                cs.draw.setAlpha(particle.alpha/100);
                var r = Math.round(particle.c_r + particle.c_sr * particle.life);
                var g = Math.round(particle.c_g + particle.c_sg * particle.life);
                var b = Math.round(particle.c_b + particle.c_sb * particle.life);
                cs.draw.setColor(cs.particle.hexFromRgb(r,g,b));
                var cx = particle.x;
                var cy = particle.y;
                if(particle.shape == "square"){
                    cx = cx - (particle.size/2);
                    cy = cy - (particle.size/2);
                    
                    cs.draw.rect(cx, cy, particle.size, particle.size, true);  
                } else {
                    cs.draw.circle(cx, cy, particle.size);
                }
                tempParticles[tempParticles.length] = particle;
            }  
        }
        //Reset Particles with only live parts
        this.obj.particle.list = tempParticles;
    },
    rgbFromHex : function(hex){
        return { 
           r : parseInt('0x' + hex.slice(1,3)),
           g : parseInt('0x' + hex.slice(3,5)),
           b : parseInt('0x' + hex.slice(5,7)) 
        }
    },
    hexFromRgb : function(r, g, b){
        r = r.toString(16); g = g.toString(16); b = b.toString(16);
        return '#' + 
            (r.length == 1 ? '0' + r : r) + 
            (g.length == 1 ? '0' + g : g) + 
            (b.length == 1 ? '0' + b : b);
    }
}
//---------------------------------------------------------------------------------------------//
//----------------------------------| Camera Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.camera = {
    scale : 1,
    x : 0,
    y : 0,
    width : 500, maxWidth : 500,
    height : 200, maxHeight : 400,
    follow : function(obj){
        var width = this.width * this.scale/1;
        var height = this.height * this.scale/1;

        this.x = obj.x-width/2;
        this.y = obj.y-height/2;

        //Check if camera over left
        if(this.x < 0){ this.x = 0;}
        if(this.x+width > cs.room.width){
            this.x = cs.room.width - width;
        }

        //Check is camera under or over
        if(this.y < 0){ this.y = 0; }
        if(this.y + height > cs.room.height){
            this.y = cs.room.height - height;
        }
    },
    zoomOut : function(){
        for(var i = 0; i < cs.draw.game.length; i++){
            cs.draw.game[i].canvas.width = cs.draw.game[i].canvas.width;
            if(cs.camera.scale < 1){
                cs.camera.scale += 0.25;
            } else {
                cs.camera.scale += 1;
            }
            cs.draw.game[i].ctx.scale(1/cs.camera.scale, 1/cs.camera.scale);
            cs.draw.game[i].ctx.imageSmoothingEnabled = false;
            cs.draw.game[i].ctx.mozImageSmoothingEnabled = false;
        }
    }, 
    zoomIn : function(){
        for(var i = 0; i < cs.draw.game.length; i++){
            cs.draw.game[i].canvas.width = cs.draw.game[i].canvas.width;
            if(cs.camera.scale <= 1){
                cs.camera.scale -= 0.25;
                if(cs.camera.scale <= 0.25){
                    cs.camera.scale = 0.25;
                }
            } else {
                cs.camera.scale -= 1;
            }
            cs.draw.game[i].ctx.scale(1/cs.camera.scale, 1/cs.camera.scale);
            cs.draw.game[i].ctx.imageSmoothingEnabled = false;
            cs.draw.game[i].ctx.mozImageSmoothingEnabled = false;
        }
    }
}
//---------------------------------------------------------------------------------------------//
//---------------------------------| Physics Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.pos = {
    meet : function(objtype, x1, y1, x2, y2){
        var i = cs.obj.list.length-1; while(i--){
            if (i !== this.id && cs.obj.list[i].type == objtype){
                var obj2 = cs.obj.list[i];
                var obj2top = obj2.y;
                var obj2bottum = obj2.y + obj2.height;
                var obj2left = obj2.x;
                var obj2right = obj2.x + obj2.width;

                var obj1top = y1;
                var obj1bottum = y2;
                var obj1left = x1;
                var obj1right = x2;

                if (obj1bottum > obj2top && obj1top < obj2bottum && 
                    obj1left < obj2right && obj1right > obj2left){
                    return i;
                }       
            }
        }
        return -1;
    }
}
//---------------------------------------------------------------------------------------------//
//-----------------------------------| Room Functions |----------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.room = {
    width : 1000,
    height:400,
    load : function(room){
        var load = JSON.parse(testmap);
        for(var i = 0; i < load.objects.length; i++){
            var tmp_cnt = cs.obj.list.length;
            cs.obj.list[tmp_cnt] = load.objects[i];
        }
        cs.room.info = load.room;
    },
    save : function(){
        //Get Object List
        var save = {};
        save.room = cs.room.info;
        save.objects = [];
        for(var i = 0; i < cs.obj.list.length; i++){
            if(cs.obj.list[i].core === false){
                var tmp_cnt = save.objects.length;
                save.objects[tmp_cnt] = cs.obj.list[i];
            }
        }
        console.log(JSON.stringify(save));
    }
}
//---------------------------------------------------------------------------------------------//
//------------------------------| Text Input Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.input = {
    state : 0,
    openBy : 0,
    text : '',
    form : undefined,
    input : undefined,
    button : undefined,
    create : function(){
        var form = document.createElement('form');
        form.id = 'textInputForm';
        form.setAttribute('onsubmit', 'cs.input.close(); return false');
        form.setAttribute('autocomplete', 'off');
        var input = document.createElement('input');
        input.id = 'textInputText';
        input.setAttribute('autocomplete', 'off');
        input.type = 'text';
        
        var button = document.createElement('button');
        button.type = 'submit';
        button.innerHTML = 'Enter';
        
        form.appendChild(input);
        form.appendChild(button);
        document.body.appendChild(form);
        
        this.form = form;
        this.input = input;
        this.button = button;
    },
    open : function(id){
        if(this.form.style.display !== 'block'){
            this.openBy = id;
            this.form.style.display = 'block';
            this.input.click();
            this.input.focus();
        }
    },
    close : function(){
        if(this.form.style.display == 'block'){
            this.form.style.display = 'none';
            this.text = this.input.value; 
            document.getElementById('view').click();
            document.getElementById('view').focus();
            this.input.value = '';
        }
        return false;
    },
    return : function(id){
        var text = this.text; 
        if(this.openBy == id && text !== ''){
            this.text = '';
            return text;
        }
        return '';
    },
    resize : function(){
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;

        var border = 2;
        var cont = this.form;
        var input = this.input;
        var button = this.button;
        var h = 50
        var nw = winWidth;

        var bw = 100;
        var iw = nw-bw;
        //Width
        cont.style.width=nw + 'px';
        input.style.width=iw + 'px';
        button.style.width=bw + 'px';
        //Height
        input.style.height = h + 'px';
        button.style.height = h + 'px';
        button.style.lineHeight = (h-border*2) + 'px';

        button.style.border = border + 'px solid black';
        input.style.border = border + 'px solid black'; 
    }
}
//---------------------------------------------------------------------------------------------//
//---------------------------------| Key Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.key = {
    up : {},
    down : {},
    held : {},
    events : [],
    addEvent : function(keyCode, eventType){
        var num = cs.key.events.length;
        cs.key.events[num] = {
            event : eventType,
            key : keyCode
        }
        
    },
    execute : function(){
        for(var i = 0; i < cs.key.events.length; i++){
            var event = cs.key.events[i].event;
            var key = cs.key.events[i].key;
            cs.key.processEvent(key, event);
        }     
        cs.key.events = [];
    },
    processEvent : function(keyCode, type){
        if(type == 'up'){
            cs.key.up[keyCode] = true;
        } else {
            cs.key.down[keyCode] = true;
            cs.key.held[keyCode] = true;
        }
    },
    updateDown : function(keyEvent){
        keyEvent.preventDefault();
        if(!keyEvent.repeat){
            var key = keyEvent.keyCode;
            cs.key.virtualDown(key);
        }
    },
    updateUp : function(keyEvent){
        var key = keyEvent.keyCode;
        cs.key.virtualUp(key);
    },
    virtualDown : function(keyCode){
        cs.key.addEvent(keyCode, 'down');
    },
    virtualUp : function(keyCode){ 
        cs.key.addEvent(keyCode, 'up');
    },
    virtualPress : function(key){
        this.virtualDown(key); 
        this.virtualUp(key);
    },
    reset : function(){
        for(var tmp in cs.key.down){
            cs.key.down[tmp] = false;
            if(cs.key.up[tmp]){
                cs.key.held[tmp] = false;
            }
            cs.key.up[tmp] = false;
        }
    }
}
//---------------------------------------------------------------------------------------------//
//-------------------------------| Mouse Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.mouse = {
    move : function(e){
        cs.mouse.x = e.clientX;
        cs.mouse.y = e.clientY;
        
        cs.touch.updatePos(-1, e.clientX, e.clientY);
    },
    down : function(e){
        cs.touch.add(-1);
        cs.touch.updatePos(-1, e.clientX, e.clientY);
    },
    up : function(e){
        cs.touch.remove(-1);
    }
}
//---------------------------------------------------------------------------------------------//
//-------------------------------| Touch Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.touch = {
    list : [],
    add : function(id){
        for(var i = 0; i < cs.touch.list.length; i++){
            if(cs.touch.list[i].used === false) break;
        }
        
        cs.touch.list[i] = {};
        cs.touch.list[i].used = false;
        cs.touch.list[i].down = true;
        cs.touch.list[i].up = false;
        cs.touch.list[i].x = 0;
        cs.touch.list[i].y = 0;
        cs.touch.list[i].id = id;  
    },
    remove : function(id){
        for(var i = 0; i < cs.touch.list.length; i++){
            if(cs.touch.list[i].id == id){
                cs.touch.list[i].down = false;
                cs.touch.list[i].up = true;
            }
        }
    },  
    down : function(e){
        cs.touch.add(e.changedTouches[0].identifier);
        cs.touch.move(e);
        
    },
    up : function(e){
        var id = e.changedTouches[0].identifier;
        cs.touch.remove(id);
    },
    updatePos : function(id, x, y){
        for(var i = 0; i < cs.touch.list.length; i++){
            var touch = cs.touch.list[i];
            if(touch.id == id){
                var canvas = cs.draw.view.canvas;
                var rect = canvas.getBoundingClientRect();

                var physicalViewWidth = (rect.right-rect.left);
                var physicalViewHeight = (rect.bottom-rect.top);   
                var hortPercent = (x - rect.left)/physicalViewWidth;
                var vertPercent = (y - rect.top)/physicalViewHeight;

                touch.x = Math.round(hortPercent*canvas.width);
                touch.y = Math.round(vertPercent*canvas.height);
            }
        }
    },
    move: function(e){
        e.preventDefault();     
        for(var i = 0; i < e.changedTouches.length; i++){
            var etouch = e.changedTouches[i];
            cs.touch.updatePos(etouch.identifier, etouch.clientX, etouch.clientY);
        }
    },
    create : function(test){
        return {
            down : false,
            held : false,
            up : false,
            raw : test,
            x : 0, y : 0,
            off_x : 0, off_y : 0,
            id : -1,
            inside : function(x, y, width, height){
                var cx = this.x;
                var cy = this.y;
                return (cx > x && cx < x+width && cy > y && cy < y+height); 
            },
            check : function(x, y, width, height){
                
                if(this.id !== -1){
                    var touch = cs.touch.list[this.id];
                    this.x = touch.x;
                    this.y = touch.y;
                    if(!this.raw){
                        this.x = (touch.x * cs.camera.scale) + cs.camera.x;         
                        this.y = (touch.y * cs.camera.scale) + cs.camera.y;   
                    } 
                    this.down = touch.down;
                    this.held = touch.held;
                    this.up = touch.up;
                    if(this.up){
                        touch.used = false;
                        this.held = false;
                        this.id = -1;
                    }
                } else {
                    this.up = false;
                    for(var i = 0; i < cs.touch.list.length; i++){
                        var ctouch = cs.touch.list[i];
                        
                        var cx = ctouch.x;
                        var cy = ctouch.y;
                        if(!this.raw){
                            cx = (ctouch.x * cs.camera.scale) + cs.camera.x;         
                            cy = (ctouch.y * cs.camera.scale) + cs.camera.y; 
                        } 
                        
                        if(ctouch.down === true && ctouch.used === false){
                            if(cx > x && cx < x+width && cy > y && cy < y+height){
                                //Being Touched
                                ctouch.used = true;
                                this.down = true;
                                this.id = i;

                                this.x = cx;
                                this.y = cy;
                                
                                this.off_x = cx-x;
                                this.off_y = cy-y;
                            }
                        } 
                    }
                }
            }
        }
    },
    reset : function(){
        for(var i = 0; i < cs.touch.list.length; i++){
            if(cs.touch.list[i].down === true){
                cs.touch.list[i].down = false;
                cs.touch.list[i].held = true;
            }
            cs.touch.list[i].up = false;
        }
    }
}
//---------------------------------------------------------------------------------------------//
//------------------------------------| Math Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.math = {
    sign : function(number){
        return (number >= 0) ? 1 : -1;
    },
    iRandomRange : function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
//---------------------------------------------------------------------------------------------//
//------------------------------------| Networking |-------------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.network = {
    ws : {},
    connect : function(options){
        var host = (options.ip == undefined) ? window.location.host : options.hostname;
        if(options.ssl == undefined || options.ssl == false){
            var url = "ws://"+host+":"+options.port;
        } else {
            var url = "wss://"+host+":"+options.port;
        }
        var ws = new WebSocket(url); 
        ws.onopen = function(){ cs.network.onconnect() }
        ws.onclose = function(){ cs.network.ondisconnect() }
        ws.onmessage =  function(event){ cs.network.onmessage(event.data) }
        cs.network.ws = ws;
    },
    send: function(data){
        if(typeof data !== 'string'){
            data = JSON.stringify(data);
        }
        cs.network.ws.send(data);
    },
    onconnect : function(){
        console.log('You have no event override for onconnect');
    },
    onmessage: function(message){
        console.log('You have no event override for onmessage');
    },
    ondisconnect: function(){
        console.log('You have no event override for ondisconnect');
    }
}