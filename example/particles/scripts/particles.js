cs.script.particles = {
   list: [],
   createSystem: function(settings) {
      var particleSystem = {
         list: [],
         settings: settings
      }

      this.list.push(particleSystem)
      return particleSystem
   },
   burst: function(options) {
      var options = cs.default(options, {})
      var num = cs.default(options.qty, 0);

      if (num < 0) {
         num = (Math.floor(Math.random() * Math.abs(num)) === 1)
      }
      for (var i = 0; i < num; i++) {
         var c1 = this.rgbFromHex(options.system.settings.colorEnd);
         var c2 = this.rgbFromHex(options.system.settings.colorStart);
         var life = cs.math.iRandomRange(options.system.settings.lifeMin, options.system.settings.lifeMax);
         var dir = cs.math.iRandomRange(options.system.settings.dirMin, options.system.settings.dirMax);
         var speed = cs.math.iRandomRange(options.system.settings.speedMin, options.system.settings.speedMax);
         var speedX = Math.cos(dir * Math.PI / 180);
         var speedY = Math.sin(dir * Math.PI / 180);
         var new_part = {
            shape: options.system.settings.shape,
            c_r: c1.r,
            c_g: c1.g,
            c_b: c1.b,
            c_sr: (c2.r - c1.r) / life,
            c_sg: (c2.g - c1.g) / life,
            c_sb: (c2.b - c1.b) / life,
            alpha: options.system.settings.alpha,
            fade: options.system.settings.fade,
            size: options.system.settings.size,
            grow: options.system.settings.grow,
            speed: speed / 10,
            speedX: speedX,
            speedY: speedY,
            dir: dir,
            accel: options.system.settings.accel / 10,
            accelRate: options.system.settings.accel / 100,
            gravity: options.system.settings.gravity / 10,
            gravityRate: options.system.settings.gravity / 100,
            life: life,
            x: cs.math.iRandomRange(options.x, options.x + options.w),
            y: cs.math.iRandomRange(options.y, options.y + options.h),
            wobbleX: cs.math.iRandomRange(-options.system.settings.wobbleX, options.system.settings.wobbleX),
            wobbleSetX: options.system.settings.wobbleX,
            wobbleY: cs.math.iRandomRange(-options.system.settings.wobbleY, options.system.settings.wobbleY),
            wobbleSetY: options.system.settings.wobbleY,
         }
         var len = options.system.list.length;
         options.system.list[len] = new_part;
      }
   },
   step: function(options) {
      var tempParticles = [];
      for (var i = 0; i < options.system.list.length; i++) {
         var particle = options.system.list[i];
         particle.life -= 1;
         particle.size = particle.size + particle.grow / 100;
         particle.alpha = particle.alpha - particle.fade / 10;
         if (particle.life > 0 && particle.alpha > 0 && particle.size > 0) {
            //Accelleration
            particle.accel += particle.accelRate;
            particle.gravity -= particle.gravityRate;

            //Wobble
            if (particle.wobbleSetX !== 0) {
               if (particle.wobbleX > 0) {
                  particle.wobbleX -= 1;
                  particle.x -= 1;
                  if (particle.wobbleX === 0) particle.wobbleX = -particle.wobbleSetX
               } else {
                  particle.wobbleX += 1;
                  particle.x += 1;
                  if (particle.wobbleX === 0) particle.wobbleX = particle.wobbleSetX
               }
            }
            if (particle.wobbleSetY !== 0) {
               if (particle.wobbleY > 0) {
                  particle.wobbleY -= 1;
                  particle.y -= 4;
                  if (particle.wobbleY === 0) particle.wobbleY = -particle.wobbleSetY
               } else {
                  particle.wobbleY += 1;
                  particle.y += 4;
                  if (particle.wobbleY === 0) particle.wobbleY = particle.wobbleSetY
               }
            }

            //Position Particle?
            var speed = particle.speed + particle.accel
            particle.x += particle.speedX * speed;
            particle.y += particle.speedY * (speed + particle.gravity);

            //Draw Particle
            cs.draw.setAlpha(particle.alpha / 100);
            var r = Math.round(particle.c_r + particle.c_sr * particle.life);
            var g = Math.round(particle.c_g + particle.c_sg * particle.life);
            var b = Math.round(particle.c_b + particle.c_sb * particle.life);
            cs.draw.setColor(this.hexFromRgb(r, g, b));
            var cx = particle.x;
            var cy = particle.y;
            if (particle.shape == "square") {
               cx = cx - (particle.size / 2);
               cy = cy - (particle.size / 2);
               cs.draw.fillRect({
                  x: Math.floor(cx),
                  y: Math.floor(cy),
                  width: particle.size,
                  height: particle.size
               });
            } else {
               cs.draw.circle({
                  x: cx,
                  y: cy,
                  radius: particle.size,
                  fill: true
               })
            }
            tempParticles[tempParticles.length] = particle;
         }
      }
      //Reset Particles with only live parts
      options.system = tempParticles;
   },
   rgbFromHex: function(hex) {
      return {
         r: parseInt('0x' + hex.slice(1, 3)),
         g: parseInt('0x' + hex.slice(3, 5)),
         b: parseInt('0x' + hex.slice(5, 7))
      }
   },
   hexFromRgb: function(r, g, b) {
      r = r.toString(16);
      g = g.toString(16);
      b = b.toString(16);
      return '#' +
         (r.length == 1 ? '0' + r : r) +
         (g.length == 1 ? '0' + g : g) +
         (b.length == 1 ? '0' + b : b);
   }
}
