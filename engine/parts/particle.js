//---------------------------------------------------------------------------------------------//
//-----------------------------| Particle Engine Functions |-----------------------------------//
//---------------------------------------------------------------------------------------------//
cs.particle = {
    settings : {},
    obj : {},
    burst : function(x, y, w, h, qty){
       if(typeof qty == 'undefined') qty = 0
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
                        if(particle.wobbleX === 0) particle.wobbleX = -particle.wobbleSetX
                    } else {
                        particle.wobbleX += 1; particle.x += 1;
                        if(particle.wobbleX === 0) particle.wobbleX = particle.wobbleSetX
                    }
                }
                if(particle.wobbleSetY !== 0){
                    if(particle.wobbleY > 0){
                        particle.wobbleY -= 1; particle.y -= 4;
                        if(particle.wobbleY === 0) particle.wobbleY = -particle.wobbleSetY
                    } else {
                        particle.wobbleY += 1; particle.y += 4;
                        if(particle.wobbleY === 0) particle.wobbleY = particle.wobbleSetY
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

                    cs.draw.fillRect({ x:cx, y:cy, width:particle.size, height:particle.size });
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
