//---------------------------------------------------------------------------------------------//
//-----------------------------------| Object Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.obj = {
   list : [],
   types : {},
   objGroups: {},
   unique: 0,
	newObjects: [],
   create : function(options){
      var attr = options.attr
      var object = cs.objects[options.type]
      var zIndex = cs.objects[options.type].zIndex || 0

      //Create the object
      var newObj = {
         core: {
            zIndex: zIndex,
            live: true,
            type: options.type,
            id: this.unique,
            core: object.core || false,
            surface: 'game',
            particle: { list : [], settings : {} },
            touch: cs.touch.create()
         }
      }

      //Predefined and Custom Attr
      for(var name in object.attr){ newObj[name] = object.attr[name] }
      for(var name in attr){ newObj[name] = attr[name] }

      //Run Create event
      object.create.call(newObj);

      //Add the object to the list
      this.newObjects.push({ obj: newObj, zIndex: zIndex })//this.list.splice(pos, 0, newObj))
      this.unique += 1

      //Object Grouping
      if(!this.objGroups[options.type]) this.objGroups[options.type] = []
      this.objGroups[options.type].push(newObj)
      return newObj
   },
	addNewObjects: function() {
		while(this.newObjects.length) {
			var obj = this.newObjects.shift()
			var pos = this.findPosition(obj.zIndex)
			this.list.splice(pos, 0, obj.obj)
		}
	},
   destroy : function(destroyObj){
      var type = destroyObj.core.type
      if(typeof destroyObj === 'object'){
         destroyObj.core.live = false
      } else {
         for(var obj of cs.obj.list){
            if(obj.core.id === destroyObj){
               obj.core.live = false
               var type = obj.core.type
               destroyObj = obj
            }
         }
      }
      if(cs.objects[type].destroy) cs.objects[type].destroy.call(destroyObj)
      this.objGroups[type] = this.objGroups[type].filter(function(obj){ return obj.core.live })
   },
   findPosition : function(zIndex){
      for(var i = 0; i < this.list.length; i++){
         if(zIndex >= this.list[i].core.zIndex)
            return i
      }
      return i
   },
   undefined: function(type){
      return typeof cs.objects[type] === 'undefined' ? true : false
   },
	every: function() {
		return this.list.concat(this.newObjects.map((obj) => obj.obj))
	},
   all: function(type){
      return this.objGroups[type] || []
   },
   find: function(type){
      return this.objGroups[type][0]
   },
   id: function(id){
      return this.list.find(function(e){ return e.core.id == id})
   },
   count: function(type){
      return this.objGroups[type] ? this.objGroups[type].length : 0
   }
}
