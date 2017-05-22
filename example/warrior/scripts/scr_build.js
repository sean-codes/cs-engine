/******************************************************************************
Need to invent some sort of saving mechanism for maps using json. If we start
saving these serverside we might look into our own JSON parsers that doesn't
require reading the entire text document.

var maps = [
   {
      name: 'forest',
      width: 500,
      height: 500,
      settings: {
         gravity: 0.5,
         weather: rain
      },
      objects: [
         {
            type: 'obj_block',
            position: {
               x: xpos,
               y: ypos
            },
            settings: {
               sprite: 'spr_block2',
               width: 96,
               friction: 0.5
            }
         }
      ]
   }
]
/******************************************************************************/

cs.script.build = {
   map: {
      create: function(options){
         cs.global.build.maps.push({
            name: options.name,
            width: options.width,
            height: options.height,
            settings: options.settings,
            objects: []
         })
      },
      remove: function(name){
         cs.global.build.maps.splice(this.getID(name), 1)
      },
      load: function(name){
         this.clear()
         for(var obj of cs.global.build.maps[this.getID(name)].objects)
            cs.script.build.obj.load(obj)
      },
      save: function(){

      },
      clear: function(){
         //Remove current objects from the room
      },
      getID: function(name){
         var i = cs.global.build.maps.length;
         while(i--)
            if(cs.global.build.maps[i].name == name) return i
      }
   },
   obj: {
      add: function(){
         //cs.global.maps.current
      },
      delete: function(){

      },
      load: function(obj){
         cs.obj.create(obj.type, obj.pos.x, obj.pos.y)
      }
   }
}
