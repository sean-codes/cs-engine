//---------------------------------------------------------------------------------------------//
//---------------------------------| Key Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.key = {
    up : {},
    down : {},
    held : {},
    events : [],
    addEvent : function(keyCode, eventType){
        var num = cs.key.events.length
        cs.key.events[num] = {
            event : eventType,
            key : keyCode
        }
    },
    execute : function(){
        for(var i = 0; i < cs.key.events.length; i++){
            var event = cs.key.events[i].event;
            var key = cs.key.events[i].key
            cs.key.processEvent(key, event)
        }
        cs.key.events = [];
    },
    processEvent : function(keyCode, type){
       if(type == 'up'){
          if(!cs.key.up[keyCode])
            cs.key.up[keyCode] = true
          return
       }

      cs.key.down[keyCode] = true;
      cs.key.held[keyCode] = true;
    },
    updateDown : function(keyEvent){
        keyEvent.preventDefault();
        if(!keyEvent.repeat){
            var key = keyEvent.keyCode;
            cs.key.virtualDown(key);
        }
    },
    updateUp : function(keyEvent){
        var key = keyEvent.keyCode;
        cs.key.virtualUp(key);
    },
    virtualDown : function(keyCode){
        cs.key.addEvent(keyCode, 'down');
    },
    virtualUp : function(keyCode){
        cs.key.addEvent(keyCode, 'up');
    },
    virtualPress : function(key){
        this.virtualDown(key);
        this.virtualUp(key);
    },
    reset : function(){
        for(var tmp in cs.key.down){
            cs.key.down[tmp] = false
            if(cs.key.up[tmp])
                cs.key.held[tmp] = false

            cs.key.up[tmp] = false
        }
    }
}
