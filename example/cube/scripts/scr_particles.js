cs.script.particles = {
   init: function(settings) {
      return {
         particles: [],
         settings: cs.clone(settings)
      }
   },

   burst: function(options) {
      var settings = options.system.settings
      if (Math.random() < settings.interval) {
         for(var i = 0; i < settings.count; i++) this.create(options)
      }

      options.system.particles = options.system.particles.filter(function(particle) {
         return particle.life
      })
   },

   create: function(options) {
      var settings = options.system.settings
      var area = options.area
      var x = Math.random()*area.width
      var y = Math.random()*area.height

      var totalGaussian = Math.random() * (settings.gaussian || 1)

      var targetY = area.height/2
      var differenceY = y - targetY
      y -= (differenceY * totalGaussian)

      var targetX = area.width/2
      var differenceY = x - targetX
      x -= (differenceY * totalGaussian)

      var life = settings.life - (settings.life * totalGaussian)
      var size = cs.math.randomRange(settings.size.min, settings.size.max)
      var speed = cs.math.randomRange(settings.speed.min, settings.speed.max)
      var direction = cs.math.randomRange(settings.direction.min, settings.direction.max)
      var color = settings.colors[Math.floor(Math.random() * settings.colors.length)]
      var rgbStart = this.rgbFromHex(color[0])
      var rgbEnd = this.rgbFromHex(color[1])
      var rgbChange = {
         r: (rgbEnd.r - rgbStart.r) / settings.life,
         g: (rgbEnd.g - rgbStart.g) / settings.life,
         b: (rgbEnd.b - rgbStart.b) / settings.life,
      }

      var particle = {
         color: {
            value: rgbStart,
            change: rgbChange
         },
         x: area.x - area.width/2 + x,
         y: area.y - area.height/2 + y,
         size: size,
         direction: direction * (Math.PI/180),
         speed: speed,
         accel: settings.accel,
         alpha: settings.alpha,
         fade: settings.fade,
         grow: settings.grow,
         life: settings.life,
         shape: settings.shape,
         wobble: {
            time: settings.wobble.time,
            timer: settings.wobble.timer,
            amount: settings.wobble.amount * (Math.PI/180),
            direction: Math.random() > 0.5 ? 1 : -1,
         }
      }

      options.system.particles.unshift(particle)
   },

   step: function(particleSystem) {
      for (var particle of particleSystem.particles) {
         this.stepParticle(particle)
      }
   },

   stepParticle: function(particle) {
      particle.life -= 1
      particle.speed += particle.accel
      var hSpeed = Math.cos(particle.direction) * particle.speed
      var vSpeed = Math.sin(particle.direction) * particle.speed
      particle.x += hSpeed
      particle.y += vSpeed

      if (particle.wobble.time) {
         particle.direction += particle.wobble.amount * particle.wobble.direction
         particle.wobble.timer -= 1
         if (!particle.wobble.timer) {
            particle.wobble.timer = particle.wobble.time
            particle.wobble.direction *= -1
         }
      }

      particle.color.value.r += particle.color.change.r
      particle.color.value.g += particle.color.change.g
      particle.color.value.b += particle.color.change.b

      particle.alpha = Math.max(particle.alpha - particle.fade, 0)
      particle.size = Math.max(particle.size + particle.grow, 0)

      if (particle.alpha <= 0) particle.life = 0
      if (particle.size <= 0) particle.life = 0

      cs.draw.settings({ color: particle.color.value.toString(), alpha: particle.alpha })

      if (particle.shape == 'square') {
         cs.draw.fillRect({
            x: Math.round(particle.x - Math.round(particle.size/2)),
            y: Math.round(particle.y - Math.round(particle.size/2)),
            width: Math.round(particle.size),
            height: Math.round(particle.size)
         })
      }

      if (particle.shape == 'circle') {
         cs.draw.circle(particle.x, particle.y, particle.size);
      }
   },

   rgbFromHex: function(hex) {
      if(hex.length == 4) {
         hex = hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3]
      }

      return {
         r: parseInt('0x' + hex.slice(1, 3)),
         g: parseInt('0x' + hex.slice(3, 5)),
         b: parseInt('0x' + hex.slice(5, 7)),
         toString: function() {
            return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`
         }
      }
   }
}
