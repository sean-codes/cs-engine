cs.load({
   // path: "http://localhost/cs-engine/src",
   path: "https://sean-codes.github.io/cs-engine/src",
   canvas: canvas,

   assets: {
      scripts: [
         { path: '/objects/background' },
         { path: '/objects/player' },
         { path: '/objects/controller' },
         { path: '/scripts/network' },
         { path: '/scripts/networkFunctions' },
      ],
      storages: [
         { path: '/storage/keymap', location: 'keymap' },
      ]
   },

   start: () => {
      cs.room.setup({
         width: 300,
         height: 300
      })

      cs.camera.setup({
         maxWidth: 150,
         maxHeight: 150
      })

      cs.surface.create({ name: 'background', oneToOne: false, drawOutside: true, manualClear: true, depth: 100 })

      cs.global.keymap = cs.storage.read('keymap')
      cs.global.self = undefined

      cs.object.create({ type: 'controller' })
      cs.object.create({ type: 'background' })
      cs.script.network.init()
   },

   step: () => {

   },

   draw: () => {
      var bgSquareSize = 1
   }
})
