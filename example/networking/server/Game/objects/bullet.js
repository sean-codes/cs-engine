module.exports = {
   create: function({ attr }) {
      const { cs } = this
      this.radius = 4
      this.pos = attr.pos
      this.speed = cs.vector.scale(cs.vector.create(
         cs.math.cos(attr.angle),
         cs.math.sin(attr.angle)
      ), attr.speed)

      this.timer = 90

      cs.script.networkObjects.objectCreate(this)
   },

   share: function() {
      return {
         pos: this.pos,
         speed: this.speed
      }
   },

   snapshotWrite: function() {
      const { cs } = this
      return [
         cs.math.round(this.pos.x, 100),
         cs.math.round(this.pos.y, 100)
      ]
   },

   step: function() {
      const { cs } = this
      this.pos = cs.vector.add(this.pos, this.speed)

      this.timer -= 1
      if (this.timer < 0) cs.object.destroy(this)
   },

   destroy() {
      const { cs } = this
      cs.script.networkObjects.objectDestroy(this)
   }
}
