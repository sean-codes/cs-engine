/* global cs */

cs.objects.bullet = {
   zIndex: 1,
   create: function({ cs, attr }) {
      this.radius = 1
      this.networkId = attr.networkId
      this.pos = attr.share.pos
      this.speed = attr.share.speed
   },

   snapshotRead: function(snapshot) {
      const [ id, x, y ] = snapshot

      this.pos.x = cs.script.smooth(this.pos.x, x, 100)
      this.pos.y = cs.script.smooth(this.pos.y, y, 100)
   },

   step: function({ cs }) {
      this.pos = cs.vector.add(this.pos, this.speed)
   },

   draw: function({ cs }) {
      cs.draw.setWidth(0.5)
      cs.draw.circle({
         x: this.pos.x,
         y: this.pos.y,
         radius: this.radius,
         fill: true
      })

   }
}
