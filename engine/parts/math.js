//---------------------------------------------------------------------------------------------//
//------------------------------------| Math Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.math = {
   sign: function(number) {
      if (!number) return 0
      return number < 0 ? -1 : 1
   },

   between: function(num, min, max) {
      return num >= Math.min(min, max) && num <= Math.max(min, max)
   },

   outside: function(num, min, max) {
      return num < Math.min(min, max) || num > Math.max(min, max)
   },

   randomRange: function(min, max) {
      return (min + Math.random() * (max-min))
   },

   iRandomRange: function(min, max) {
      return Math.round(this.randomRange(min, max))
   },

   choose: function(array) {
      return array[this.iRandomRange(0, array.length - 1)]
   },

   chooseRatio: function(ratios) {
      // ratios = { "50": "Choice1", "100": "Choice2" }
      var random = Math.random() * 100
      for (var ratio in ratios) {
         if (parseInt(ratio) > random) {
            return ratios[ratio]
         }
      }
      return ratios[ratio]
   },

   brakingDistance: function(options) {
      return (Math.abs(options.speed) * options.friction) / (1 - options.friction)
   },

   requiredSpeed: function(options) {
      return Math.sqrt(2 * options.friction * options.distance);
   },

   inRange: function(options) {
      return options.num > options.min && options.num < options.max
   },

   sin: function(angleInDegrees) {
      return Math.sin((angleInDegrees-90) * Math.PI/180)
   },

   cos: function(angleInDegrees) {
      return Math.cos((angleInDegrees-90) * Math.PI/180)
   },

   degrees: function(radians) {
      return radians * (180/Math.PI)
   },

   distance: function(p1, p2) {
      var a2 = (p1.x - p2.x) * (p1.x - p2.x)
      var b2 = (p1.y - p2.y) * (p1.y - p2.y)
      return Math.sqrt(a2 - b2)
   },

   direction: function(p1, p2) {
      var xOff = p2.x - p1.x
      var yOff = p2.y - p1.y
      var beforeTurn = cs.math.degrees(Math.atan2(xOff, -yOff)) + 180
      var afterTurn = beforeTurn + 180
      if (afterTurn > 360) {
         afterTurn -= 360
      }
      return afterTurn
   },

   stepsToSeconds: function(steps) {
      return Math.round(steps / (60)) + 's'
   }
}
