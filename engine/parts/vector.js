cs.vector = {
   create: function(x, y) {
      return { x: x, y: y }
   },

   clone: function(v) {
      return cs.vector.create(v.x, v.y)
   },

   add: function(v0, v1) {
      return cs.vector.create(
         v0.x + v1.x,
         v0.y + v1.y
      )
   },

   min: function(v0, v1) {
      return cs.vector.create(
         v0.x - v1.x,
         v0.y - v1.y
      )
   },

   scale: function(v, s) {
      return cs.vector.create(
         v.x * s,
         v.y * s
      )
   },

   dot: function(v0, v1) {
      return v0.x * v1.x + v0.y * v1.y
   },

   length: function(v) {
      return Math.sqrt(v.x * v.x + v.y * v.y)
   },

   unit: function(v) {
      return cs.vector.scale(v, 1/cs.vector.length(v))
   },

   distance: function(v0, v1) {
      return cs.vector.length(cs.vector.min(v0, v1))
   },

   cross: function(v) {
      return cs.vector.create(-v.y, v.x)
   },

   direction: function(v0, v1) {
      return cs.vector.unit(cs.vector.min(v1, v0))
   }
}
