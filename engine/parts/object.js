//---------------------------------------------------------------------------------------------//
//-----------------------------------| Object Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.obj = {
   list : [],
   types : {},
   objGroups: {},
   unique: 0,
   create : function(options){
      var object = cs.objects[options.type]
      var zIndex = cs.objects[options.type].zIndex || 0
      var pos = this.findPosition(zIndex)

      //Create the object
      var newObj = {
         zIndex: zIndex,
         live: true,
         type: options.type,
         id: this.unique,
         core: object.core || false,
         surface: 'game',
         particle: { list : [], settings : {} },
         touch: cs.touch.create(),
         x: options.x || 0,
         y: options.y || 0,
         width: object.width,
         height: object.height,
         sprite: object.sprite,
      }
      //Run Create event
      object.create.call(newObj);

      //Add the object to the list
      this.list.splice(pos, 0, newObj)
      this.unique += 1

      //Object Grouping
      if(!this.objGroups[options.type]) this.objGroups[options.type] = []
      this.objGroups[options.type].push(newObj)
      return newObj
   },
   destroy : function(destroyObj){
      var type = destroyObj.type
      if(typeof destroyObj === 'object'){
         destroyObj.live = false
      } else {
         for(var obj of cs.obj.list){
            if(obj.id === destroyObj){
               obj.live = false
               var type = obj.type
               destroyObj = obj
            }
         }
      }
      if(cs.objects[type].destroy) cs.objects[type].destroy.call(destroyObj)
      this.objGroups[type] = this.objGroups[type].filter(function(obj){ return obj.live })
   },
   findPosition : function(zIndex){
      for(var i = 0; i < this.list.length; i++){
         if(zIndex >= this.list[i].zIndex)
            return i
      }
      return i
   },
   undefined: function(type){
      return typeof cs.objects[type] === 'undefined' ? true : false
   },
   all: function(type){
      return this.objGroups[type]
   },
   find: function(type){
      return this.objGroups[type][0]
   },
   id: function(id){
      return this.list.find(function(e){ return e.id == id})
   },
   count: function(type){
      return this.objGroups[type] ? this.objGroups[type].length : 0
   }
}
