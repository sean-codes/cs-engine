// -------------------------------------------------------------------------- //
// ----------------------------| CS ENGINE: VECTOR |------------------------- //
// -------------------------------------------------------------------------- //

(() => {
   class CSENGINE_VECTOR {
      constructor(cs) {
         this.cs = cs
      }

      create(x, y) {
         return { x, y }
      }

      createPolar(angle, length) {
         const { cs } = this
         return {
            x: cs.math.cos(angle) * length,
            y: cs.math.sin(angle) * length
         }
      }

      clone(v) {
         return this.cs.vector.create(v.x, v.y)
      }

      equal(v0, v1) {
         return v0.x === v1.x && v0.y === v1.y
      }

      add(v0, v1) {
         return this.cs.vector.create(
            v0.x + v1.x,
            v0.y + v1.y,
         )
      }

      min(v0, v1) {
         return this.cs.vector.create(
            v0.x - v1.x,
            v0.y - v1.y,
         )
      }

      scale(v, s) {
         return this.cs.vector.create(
            v.x * s,
            v.y * s,
         )
      }

      dot(v0, v1) {
         return v0.x * v1.x + v0.y * v1.y
      }

      length(v) {
         return Math.sqrt(v.x * v.x + v.y * v.y)
      }

      unit(v) {
         return this.cs.vector.scale(v, 1 / this.cs.vector.length(v))
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

      round(v0, hundreths = 1) {
         return {
            x: Math.round(v0.x * hundreths) / hundreths,
            y: Math.round(v0.y * hundreths) / hundreths,
         }
      }

      constrain(v, inside) {
         var sx = inside.x || 0
         var sy = inside.y || 0
         var sw = inside.width
         var sh = inside.height

         var fix = { x: v.x, y: v.y }
         if (v.x < sx) fix.x = sx
         if (v.x > sx + sw) fix.x = sx + sw
         if (v.y < sy) fix.y = sy
         if (v.y > sy + sh) fix.y = sy + sh

         return fix
      }

      closestPointOnLine(v, line) {
         var lineLength = this.distance(line[0], line[1])
         var lineDirection = this.direction(line[0], line[1])
         var pointToLine = this.min(v, line[0])

         var dot = this.dot(pointToLine, lineDirection) / lineLength
         dot = Math.min(Math.max(0, dot), 1)

         var closestPoint = this.add(line[0], this.scale(lineDirection, dot * lineLength))
         return closestPoint
      }
   }

   // export (node / web)
   if (typeof cs === 'undefined') module.exports = CSENGINE_VECTOR
   else cs.vector = new CSENGINE_VECTOR(cs) // eslint-disable-line no-undef
})()
