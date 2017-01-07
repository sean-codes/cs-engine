cs.script.compareObj = function(obj1, obj2){
    for(name in obj1){
        var val1 = obj1[name];
        var val2 = obj2[name];
        if(val1 !== val2) return false;
    }
    return true;
}