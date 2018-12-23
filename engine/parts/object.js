//---------------------------------------------------------------------------------------------//
//-----------------------------------| Object Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.object = {
   list: [], // all objects
   new: [], // newly added objects
   order: [], // order for objects to be called
   types: {},
   shouldClean: false,
   objGroups: {},
   unique: 0,

   create: function(options) {
      var attr = options.attr
      var object = cs.objects[options.type]
      var zIndex = cs.objects[options.type].zIndex || 0

      // create the object
      var newObj = {
         core: {
            zIndex: zIndex,
            live: true,
            active: true,
            type: options.type,
            id: this.unique,
            surface: 'game'
         }
      }

      // predefined / custom Attr
      for (var name in object.attr) { newObj[name] = object.attr[name] }
      for (var name in attr) { newObj[name] = attr[name] }

      // run create event
      object.create && object.create.call(newObj);

      // add to list
      this.new.push({ obj: newObj, zIndex: zIndex })
      this.unique += 1

      // grouping
      if (!this.objGroups[options.type]) this.objGroups[options.type] = []
      this.objGroups[options.type].push(newObj)


      return newObj
   },

   addNewObjects: function() {
      while (this.new.length) {
         var obj = this.new.shift()
         var pos = this.findPosition(obj.zIndex)
         this.list.splice(pos, 0, obj.obj)
      }
   },

   findPosition: function(zIndex) {
      for (var i = 0; i < this.list.length; i++) {
         if (zIndex >= this.list[i].core.zIndex)
         return i
      }
      return i
   },

   destroy: function(destroyObj) {
      this.shouldClean = true
      var type = destroyObj.core.type
      if (typeof destroyObj === 'object') {
         destroyObj.core.live = false
      } else {
         for (var obj of cs.object.list) {
            if (obj.core.id === destroyObj) {
               obj.core.live = false
               var type = obj.core.type
               destroyObj = obj
            }
         }
      }
      if (cs.objects[type].destroy) cs.objects[type].destroy.call(destroyObj)
      this.objGroups[type] = this.objGroups[type].filter(function(obj) { return obj.core.live })
   },

   clean: function() {
      if(!this.shouldClean) return
      this.list = this.list.reduce(function(sum, num) {
         if(num.core.live) sum.push(num)
         return sum
      }, [])
   },

   undefined: function(type) {
      return typeof cs.objects[type] === 'undefined' ? true : false
   },

   every: function() {
      return this.list.concat(this.new.map((obj) => obj.obj)).reduce(function(sum, num) {
         num.core.live && sum.push(num)
         return sum
      }, [])
   },

   all: function(type) {
      return this.objGroups[type] || []
   },

   find: function(type) {
      if (!this.objGroups[type]) {
         return undefined
      }
      return this.objGroups[type][0]
   },

   search: function(call) {
      return this.list.find(function(obj) {
         if (!obj.core.live) return false
         return call(obj)
      })
   },

   id: function(id) {
      return this.list.find(function(obj) { return obj.core.id === id })
   },

   count: function(type) {
      return this.objGroups[type] ? this.objGroups[type].length : 0
   }
}
