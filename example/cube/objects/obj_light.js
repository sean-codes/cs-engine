cs.objects['obj_light'] = {
    create: function(){
        this.width = 30;
        this.height = 30;

        //Create New Layer
        var newLayer = cs.draw.createSurface('game');
        this.layer = newLayer;

        //Create Global Variable
        cs.global.lightList = [];

    },
    step: function(){
        cs.draw.fillRect({ x:0, y:0, width:cs.room.width, height:cs.room.height });
        for(var i = 0; i < cs.global.lightList.length; i++){
            var light = cs.global.lightList[i];

            var obj = light.obj;
            cs.draw.setOperation('xor');

            cs.draw.circleGradient(obj.x+light.xoff, obj.y+light.yoff, light.size, '#FFF', 'rgba(255, 255, 255, 0)');

            cs.draw.setAlpha(0.075);
            cs.draw.setColor(cs.global.lightList[i].color);
            cs.draw.circle(obj.x+light.xoff, obj.y+light.yoff, light.size);
        }
        cs.draw.setLayerAlpha(0.6);
    }
}
