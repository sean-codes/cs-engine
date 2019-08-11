module.exports = {
   create: function({ cs, attr }) {
      console.log(attr)
      this.radius = 4
      this.pos = attr.pos
      this.speed = attr.speed
   },

   share: function({ cs }) {
      return [
         cs.math.round(this.pos.x, 100),
         cs.math.round(this.pos.y, 100),
         cs.math.round(this.speed.x, 100),
         cs.math.round(this.speed.y, 100)
      ]
   },

   step: function({ cs }) {
      this.pos = cs.vector.add(this.pos, this.speed)
   }
}
