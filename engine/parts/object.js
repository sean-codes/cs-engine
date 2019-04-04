//---------------------------------------------------------------------------------------------//
//-----------------------------------| Object Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.object = {
   list: [], // all objects
   new: [], // newly added objects
   types: {},
   shouldClean: false,
   objGroups: {},
   unique: 0,

   loop: function(call) {
      var i = cs.object.list.length;
      while (i--) {
         var object = cs.object.list[i]
         call(object)
      }
   },

   create: function(options) {
      if (!cs.objects[options.type]) {
         console.log('object type "' + options.type + '" does not exist')
         return undefined
      }

      var attr = options.attr
      var object = cs.objects[options.type]
      var zIndex = options.zIndex || cs.objects[options.type].zIndex || 0

      // create the object
      var newObj = {
         core: {
            zIndex: zIndex,
            live: true,
            active: true,
            drawn: false,
            type: options.type,
            id: this.unique,
            surface: cs.default(object.surface, 'game')
         }
      }

      // predefined / custom Attr
      for (var name in object.attr) { newObj[name] = object.attr[name] }
      for (var name in attr) { newObj[name] = attr[name] }

      // run create event
      object.create && object.create.call(newObj, newObj);

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
         var obj = this.new.shift().obj
         this.list.push(obj)
      }

      this.orderObjectsByZIndex()
   },

   orderObjectsByZIndex: function() {
      this.order = this.list.sort(function(a, b) {
         return b.core.zIndex === a.core.zIndex
            ? b.core.id - a.core.id
            : b.core.zIndex - a.core.zIndex
      })
   },

   changeZIndex: function(object, zIndex) {
      var listObject = object.list.find(function(listObject) {
         return listObject.obj.core.id == object.core.id
      })

      listObject.core.zIndex = zIndex

      this.orderObjectsByZIndex()
   },

   destroy: function(destroyObjOrID, fadeTimer) {
      this.shouldClean = true
      var destroyObj = (typeof destroyObjOrID === 'number')
         ? this.id(destroyObjOrID)
         : destroyObjOrID

      destroyObj.core.live = false
      destroyObj.core.active = false
      destroyObj.core.fadeTimer = fadeTimer || 0

      // remove from objGroup
      var type = destroyObj.core.type
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
      return this.list.concat(this.new.map(function(obj) { return obj.obj }))
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
   },

   reset: function() {
      this.list = []
      this.new = []
      this.objGroups = {}
      this.unique = 0
   },

   resize: function() {
      for (var object of this.list) {
         object.core.drawn = false
      }
   }
}
