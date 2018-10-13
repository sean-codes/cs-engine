cs.objects['obj_fire'] = {
   create: function() {
      this.width = 32;
      this.height = 48;
      this.vspeed = 0;
      this.gravity = 8;
      cs.script.lightAdd(this, '#0ed604', 200, 8, 8);
      this.particleSystem = cs.script.particles.createSystem({
         "shape": "circle",
         "colorStart": "#ffffff",
         "colorEnd": "#0fff0f",
         "size": 10,
         "grow": -5,
         "alpha": 1,
         "fade": -6,
         "speedMin": 43,
         "speedMax": 43,
         "dirMin": 0,
         "dirMax": 360,
         "wobbleX": 0,
         "wobbleY": 0,
         "lifeMin": 152,
         "lifeMax": 152,
         "accel": -5,
         "gravity": 0,
         "particlesPerStep": 2
      });
   },
   step: function() {
      cs.script.particles.burst({
         system: this.particleSystem,
         x: this.x,
         y: this.y,
         w: 16,
         h: 16,
         qty: -5
      })

      cs.script.particles.step({
         system: this.particleSystem
      })
   }
}
