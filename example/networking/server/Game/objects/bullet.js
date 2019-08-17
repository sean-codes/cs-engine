module.exports = {
   create: function({ cs, attr }) {
      this.radius = 4
      this.pos = attr.pos
      this.speed = cs.vector.scale(cs.vector.create(
         cs.math.cos(attr.angle),
         cs.math.sin(attr.angle)
      ), attr.speed)

      this.timer = 90

      cs.script.exec('networkObjects.objectCreate', { object: this })
   },

   share: function({ cs }) {
      return {
         pos: this.pos,
         speed: this.speed
      }
   },

   snapshotWrite: function({ cs }) {
      return [
         cs.math.round(this.pos.x, 100),
         cs.math.round(this.pos.y, 100)
      ]
   },

   step: function({ cs }) {
      this.pos = cs.vector.add(this.pos, this.speed)

      this.timer -= 1
      if (this.timer < 0) cs.object.destroy(this)
   },

   destroy({ cs }) {
      cs.script.exec('networkObjects.objectDestroy', { object: this })
   }
}
