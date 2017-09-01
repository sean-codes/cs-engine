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
    }
}
