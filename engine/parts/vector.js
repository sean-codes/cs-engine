cs.vector = {
   create: function(x, y) {
      return { x: x, y: y }
   },

   clone: function(v) {
      return cs.vector.create(v.x, v.y)
   },

   add: function(v1, v2) {
      v1.x += v2.x
      v1.y += v2.y

      return v1
   },

   min: function(v1, v2) {
      v1.x -= v2.x
      v1.y -= v2.y

      return v1
   },

   scale: function(v1, s) {
      v1.x *= s
      v1.y *= s

      return v1
   },

   length: function(v1) {
      return Math.sqrt(v1.x * v1.x + v1.y * v1.y)
   },

   normalize: function(v1) {
      return cs.vector.scale(v1, 1/cs.vector.length(v1))
   }
}
