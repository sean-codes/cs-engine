//----------------------------------------------------------------------------//
//-----------------------------| CS ENGINE: VECTOR |--------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_VECTOR {
      constructor(cs) {
         this.cs = cs
      }

      create(x, y) {
         return { x: x, y: y }
      }

      clone(v) {
         return this.cs.vector.create(v.x, v.y)
      }

      add(v0, v1) {
         return this.cs.vector.create(
            v0.x + v1.x,
            v0.y + v1.y
         )
      }

      min(v0, v1) {
         return this.cs.vector.create(
            v0.x - v1.x,
            v0.y - v1.y
         )
      }

      scale(v, s) {
         return this.cs.vector.create(
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
         return this.cs.vector.scale(v, 1/this.cs.vector.length(v))
      }

      distance(v0, v1) {
         return this.cs.vector.length(this.cs.vector.min(v0, v1))
      }

      cross(v) {
         return this.cs.vector.create(-v.y, v.x)
      }

      direction(v0, v1) {
         return this.cs.vector.unit(this.cs.vector.min(v1, v0))
      }

      round(v0, hundreths) {
         if (hundreths == null) hundreths = 1
         return {
            x: Math.round(v0.x * hundreths) / hundreths,
            y: Math.round(v0.y * hundreths) / hundreths
         }
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_VECTOR
      : cs.vector = new CSENGINE_VECTOR(cs)
})()
