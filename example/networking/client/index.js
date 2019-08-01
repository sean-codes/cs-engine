cs.load({
   path: "http://localhost/cs-engine/src",
   // path: "https://sean-codes.github.io/cs-engine/src",
   canvas: canvas,

   assets: {
      scripts: [
         { path: '/objects/player' }
      ]
   },

   start: () => {
      cs.room.setup({
         width: 400,
         height: 400
      })

      cs.camera.setup({
         maxWidth: 200,
         maxHeight: 200
      })

      cs.global.self = cs.object.create({
         type: 'player',
         attr: {
            x: cs.room.width / 2,
            y: cs.room.height / 2
         }
      })
   },

   step: () => {
      cs.camera.follow({
         x: cs.global.self.x,
         y: cs.global.self.y
      })
   }
})
