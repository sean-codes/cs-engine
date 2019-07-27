//----------------------------------------------------------------------------//
//-----------------------------| CS ENGINE: VECTOR |--------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_VECTOR {
      create(x, y) {
         return { x: x, y: y }
      }

      clone(v) {
         return cs.vector.create(v.x, v.y)
      }

      add(v0, v1) {
         return cs.vector.create(
            v0.x + v1.x,
            v0.y + v1.y
         )
      }

      min(v0, v1) {
         return cs.vector.create(
            v0.x - v1.x,
            v0.y - v1.y
         )
      }

      scale(v, s) {
         return cs.vector.create(
            v.x * s,
            v.y * s
         )
      }

      dot(v0, v1) {
         return v0.x * v1.x + v0.y * v1.y
      }

      length(v) {
         return Math.sqrt(v.x * v.x + v.y * v.y)
      }

      unit(v) {
         return cs.vector.scale(v, 1/cs.vector.length(v))
      }

      distance(v0, v1) {
         return cs.vector.length(cs.vector.min(v0, v1))
      }

      cross(v) {
         return cs.vector.create(-v.y, v.x)
      }

      direction(v0, v1) {
         return cs.vector.unit(cs.vector.min(v1, v0))
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_VECTOR
      : cs.vector = new CSENGINE_VECTOR(cs)
})()
