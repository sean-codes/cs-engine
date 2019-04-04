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
   }
}
