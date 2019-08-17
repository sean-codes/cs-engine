/* global cs */

cs.load({
   path: "/cs-engine/",
   canvas: document.getElementById('canvas'),

   assets: {
      sprites: [
         { path: './sprites/ship', name: 'ship0', fwidth: 14, yoff: 8},
      ],
      scripts: [
         { path: '/objects/background' },
         { path: '/objects/bullet' },
         { path: '/objects/controller' },
         { path: '/objects/joystick' },
         { path: '/objects/player' },
         { path: '/scripts/networkClient' },
         { path: '/scripts/networkObjects' },
         { path: '/scripts/smooth' },
      ],
      storages: [
         { path: '/storage/keymap', location: 'keymap' },
      ]
   },

   start: () => {
      cs.room.setup({
         width: 400,
         height: 400
      })

      cs.camera.setup({
         maxWidth: 150,
         maxHeight: 150,
         smoothing: 10
      })

      cs.draw.default({
         color: '#FFF',
         font: { size: 20, family: 'monospace' },
         lineHeight: 22
      })

      cs.surface.create({ name: 'background', oneToOne: false, drawOutside: true, manualClear: true, depth: 100 })

      cs.global.keymap = cs.storage.read('keymap')
      cs.global.self = undefined
      cs.global.snapshotInterval = 0
      cs.global.snapshotLast = 0

      cs.global.joystick = cs.object.create({ type: 'joystick' })
      cs.global.controller = cs.object.create({ type: 'controller' })
      cs.global.ping = 0
      cs.object.create({ type: 'background' })
      cs.scripts.network.init()

      window.addEventListener('keydown', () => {
         cs.object.destroy(cs.global.joystick)
      })
   },

   step: () => {
      if (cs.global.selfObject) {
         cs.camera.follow(cs.global.selfObject.pos)
      }
   },

   draw: () => {
      cs.draw.setSurface('gui')
      cs.draw.text({
         x: 10,
         y: 10,
         lines: [
            cs.global.ping + 'ms',
            cs.math.round(cs.network.metrics.downNow / 1000, 100) + 'kb down',
            '~' + cs.global.snapshotInterval + 'sps'
         ]
      })
   }
})
