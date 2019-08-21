cs.objects['obj_interface'] = {
   zIndex: 30,
   surface: 'gui',

   create: ({ object, cs, attr }) => {
      object.width = 30
      object.height = 30
      object.backgroundPlaying = undefined
      cs.sound.toggleMute(true)
      object.touch = cs.inputTouch.observer()
   },

   draw: ({ object, cs }) => {
      object.touch.check({ x: 0, y: 0, width: cs.draw.surface.width, height: cs.draw.surface.height })

      // sound
      if (object.touch.isDown() && object.touch.isWithin({ x: 0, y: 0, width: 14 * 3, height: 14 * 3 })) {
         cs.save.mute = !cs.save.mute
         return
      }

      if (cs.save.mute !== cs.sound.mute) cs.sound.toggleMute(cs.save.mute)

      cs.draw.sprite({
         spr: cs.sound.mute ? 'sound_off' : 'sound_on',
         x: 0,
         y: 0,
         size: 40
      })

      var btnHeightMax = 200
      var btnHeightMin = 50
      var btnSpace = 20
      var bw = 300
      var bx = cs.draw.surface.width / 2 - bw / 2

      switch (cs.save.state) {
         case 'START':
            cs.script.interface.drawButtons(['Please tap to start'])
            if (object.touch.isDown())
               cs.save.state = 'TAPTOFLAP'
            if (!object.backgroundPlaying)
               object.backgroundPlaying = cs.sound.play('background', { loop: true })
            break

         case 'TAPTOFLAP':
            cs.script.interface.drawButtons(['Tap to flap!', 'Your Best Score: ' + cs.save.topScore])
            if (object.touch.isDown()) {
               cs.save.state = 'PLAYING'
               cs.global.flap = true
            }
            break

         case 'PLAYING':
            var text = 'Score: ' + cs.global.score
            cs.draw.setFont({ size: 20, family: 'monospace', effect: 'bold' })
            var tw = Math.floor(cs.draw.textWidth(text))
            cs.draw.setAlpha(0.5)
            var rect = { x: cs.draw.surface.width - tw - 20, y: 0, width: tw + 20, height: 60 }
            cs.draw.fillRect(rect)
            cs.draw.setColor('#FFFFFF')
            cs.draw.setWidth(3)
            cs.draw.strokeRect(rect)
            cs.draw.setColor('#FFFFFF')
            cs.draw.setFont({ size: 20, family: 'monospace', effect: 'bold' })
            cs.draw.setTextAlign('end')
            cs.draw.text({
               x: cs.draw.surface.width - 10,
               y: 5,
               text: text
            })
            cs.draw.setColor('#FFFFFF')
            cs.draw.setFont({ size: 20, family: 'monospace', effect: 'bold' })
            cs.draw.setTextAlign('end')
            cs.draw.text({
               x: cs.draw.surface.width - 10,
               y: 30,
               text: 'Best: ' + cs.save.topScore
            })
            if (object.touch.isDown())
               cs.global.flap = true
            break

         case 'WRECKED':
            cs.script.interface.drawButtons(['Replay!', 'Your Best Score: ' + cs.save.topScore])
            if (cs.global.score > cs.save.topScore)
               cs.save.topScore = cs.global.score

            if (object.touch.isDown()) {
               cs.save.state = 'TAPTOFLAP'
               cs.script.reset()
            }
            break
      }
   }
}
