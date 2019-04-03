cs.objects['obj_fire'] = {
   create: function() {
      this.width = 32;
      this.height = 48;
      this.vspeed = 0;
      this.gravity = 8;
      cs.script.lightAdd(this, '#FFF', 200, 8, 8);
      this.particleSystem = cs.script.particles.init({
         "count": 1,
         "interval": 1,
         "gaussian": 1,
         "life": 120,
         "colors": [
            [
               "#F22",
               "#FFF"
            ],
            [
               "#F82",
               "#F22"
            ]
         ],
         "speed": {
            "min": 0.1,
            "max": 1
         },
         "accel": 0,
         "size": {
            "min": 0.1,
            "max": 3
         },
         "grow": 0.1,
         "shape": "square",
         "wobble": {
            "time": 60,
            "amount": 0.1
         },
         "direction": {
            "min": 270,
            "max": 270
         },
         "alpha": 1,
         "fade": 0.025
      });
   },
   step: function() {
      cs.script.particles.burst({
         system: this.particleSystem,
         area: {
            x: this.x,
            y: this.y,
            width: 20,
            height: 10
         }
      })

      cs.script.particles.step(this.particleSystem)
   }
}
