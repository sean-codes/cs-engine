cs.objects['obj_fire'] = {

   create: ({ object, cs, attr }) => {
      object.x = attr.x
      object.y = attr.y
      object.width = 32
      object.height = 48
      object.vspeed = 0
      object.gravity = 8
      cs.script.lightAdd(object, '#FFF', 200, 8, 8)
      object.particleSystem = cs.script.particles.init({
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
      })
   },

   draw: ({ object, cs }) => {
      cs.script.particles.burst({
         system: object.particleSystem,
         area: {
            x: object.x,
            y: object.y,
            width: 20,
            height: 10
         }
      })

      cs.script.particles.step(object.particleSystem)
   }
}
