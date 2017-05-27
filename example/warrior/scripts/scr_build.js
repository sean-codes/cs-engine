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
               x: xpos,
               y: ypos
               sprite: 'spr_block2',
               options: {
                  width: 96,
                  friction: 0.5
               }
            }
         }
      ]
   }
]
/******************************************************************************/
cs.script.build = {
   building: true,
   buildObject: 'obj_block',
   mapName: 'demo',
   map: undefined,
   loadedObjects: [],
   mapCreate: function(options){
      cs.global.build.maps.push({
         name: options.name,
         width: options.width,
         height: options.height,
         settings: options.settings,
         objects: []
      })
   },
   mapRemove: function(name){
      //For another time
   },
   mapExport: function(){
      console.log(JSON.stringify(this.map))
   },
   mapLoad: function(name){
      //Grab map. Maybe we should add an ajax object later
      var that = this
      var ajax = new XMLHttpRequest();
      ajax.onreadystatechange = function() {
         if(this.readyState == 4){
            that.map = JSON.parse(this.responseText)
            that.mapClear()
            that.mapLoadOptions()
            that.mapLoadObjects()
         }
      }
      ajax.open("POST", `./maps/${name}.json`, true)
      ajax.send()
   },
   mapLoadOptions: function(){
      //Load options
      cs.room.setup(this.map.width, this.map.height)
   },
   mapLoadObjects: function(){
      for(var obj of this.map.objects)
         this.objLoad(obj)
   },
   mapClear: function(){
      //Remove current objects from the room
   },
   objAdd: function(type, x, y, options){
      var newObj = { type: type, x: x, y: y, options: options }
      this.map.objects.push(newObj)
      this.objLoad(newObj)
   },
   objDelete: function(delObj){
      var that = this
      this.loadedObjects.forEach(function(obj, i){
         if(obj.id == delObj.id){
            cs.obj.destroy(obj)
            that.loadedObjects.splice(i, 1)
            that.map.objects.splice(i, 1)
         }
      })
   },
   objLoad: function(obj){
      this.loadedObjects.push(cs.obj.create(obj.type, obj.x, obj.y))
   }
}
