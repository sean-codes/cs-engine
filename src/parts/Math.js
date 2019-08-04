//----------------------------------------------------------------------------//
//------------------------------| CS ENGINE: MATH |---------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_MATH {
      constructor(cs) {
         this.cs = cs
      }

      sign(number) {
         if (!number) return 0
         return number < 0 ? -1 : 1
      }

      round(number, tenths) {
         if (tenths == null) tenths = 1
         return Math.round(number * tenths) / tenths
      }

      between(num, min, max) {
         return num >= Math.min(min, max) && num <= Math.max(min, max)
      }

      outside(num, min, max) {
         return num < Math.min(min, max) || num > Math.max(min, max)
      }

      randomRange(min, max) {
         return (min + Math.random() * (max-min))
      }

      iRandomRange(min, max) {
         return Math.round(this.randomRange(min, max))
      }

      choose(array) {
         return array[this.iRandomRange(0, array.length - 1)]
      }

      chooseRatio(ratios) {
         // ratios = { "50": "Choice1", "100": "Choice2" }
         var random = Math.random() * 100
         for (var ratio in ratios) {
            if (parseInt(ratio) > random) {
               return ratios[ratio]
            }
         }
         return ratios[ratio]
      }

      brakingDistance(options) {
         return (Math.abs(options.speed) * options.friction) / (1 - options.friction)
      }

      requiredSpeed(options) {
         return Math.sqrt(2 * options.friction * options.distance);
      }

      inRange(options) {
         return options.num > options.min && options.num < options.max
      }

      sin(angleInDegrees) {
         return Math.sin((angleInDegrees-90) * Math.PI/180)
      }

      cos(angleInDegrees) {
         return Math.cos((angleInDegrees-90) * Math.PI/180)
      }

      degrees(radians) {
         return radians * (180/Math.PI)
      }

      radians(degree) {

      }

      distance(p1, p2) {
         // a^2 + b^2 = c^2
         var a2 = (p1.x - p2.x) * (p1.x - p2.x)
         var b2 = (p1.y - p2.y) * (p1.y - p2.y)

         return Math.sqrt(a2 + b2)
      }

      anglePointToPoint(p1, p2) {
         if (p2 == undefined) {
            p2 = p1
            p1 = { x: 0, y: 0 }
         }

         var xOff = p2.x - p1.x
         var yOff = p2.y - p1.y

         return this.angleXY(xOff, yOff)
      }

      angleXY(xOff, yOff) {
         var beforeTurn = this.degrees(Math.atan2(xOff, -yOff)) + 180
         var afterTurn = beforeTurn + 180
         if (afterTurn > 360) {
            afterTurn -= 360
         }
         return afterTurn
      }

      angleToAngle(d1, d2) {
          var right = d2 - d1
          if (right < 0) {
              right = 360 + right
          }

          var left = d1 - d2
          if (left < 0) {
              left = 360 + left
          }

          return right > left ? -left : right
      }

      stepsToSeconds(steps, decimals) {
         var decimals = this.cs.default(decimals, 1)
         return Math.ceil(steps / (60) * decimals) / decimals
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_MATH
      : cs.math = new CSENGINE_MATH(cs)
})()
