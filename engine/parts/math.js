//---------------------------------------------------------------------------------------------//
//------------------------------------| Math Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.math = {
    sign : function(number){
        return number < 0 ? -1 : 1
    },
    iRandomRange : function(min, max) {
        return Math.round(min + Math.random()*(max-min))
    },
    choose: function(array){
        return array[this.iRandomRange(0, array.length-1)]
    },
    chooseRatio: function(ratios){
      // ratios = { "Choice": 50, "Choice 2": 100 }
      var random = Math.random() * 100
      for(var ratio in ratios){
         if(ratio > random){
            return ratios[ratio]
         }
      }
   }
}
