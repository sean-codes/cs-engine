cs.obj.load('obj_light', function(){
    //-------------------------------------------------------------------------------------------//
    //-------------------------------------| Create |--------------------------------------------//
    //-------------------------------------------------------------------------------------------//
    this.width = 30;
    this.height = 30;
    
    //Create New Layer
    var newLayer = cs.draw.createLayer('game');
    this.layer = newLayer;
    
    //Create Global Variable
    cs.global.lightList = [];
}, function(){
    //-------------------------------------------------------------------------------------------//
    //--------------------------------------| Step |---------------------------------------------//
    //-------------------------------------------------------------------------------------------//
    cs.draw.rect(0, 0, cs.room.width, cs.room.height, true);
    
    for(var i = 0; i < cs.global.lightList.length; i++){
        var light = cs.global.lightList[i];
        var obj = cs.obj.list[light.id];
        
        cs.draw.setOperation('xor');
        
        cs.draw.circleGradient(obj.x+light.xoff, obj.y+light.yoff, light.size);
        
        cs.draw.setAlpha(0.075);
        cs.draw.setColor(cs.global.lightList[i].color);
        cs.draw.circle(obj.x+light.xoff, obj.y+light.yoff, light.size);
    }
    cs.draw.setLayerAlpha(0.6);
});