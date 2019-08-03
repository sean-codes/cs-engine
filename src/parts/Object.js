//----------------------------------------------------------------------------//
//-----------------------------| CS ENGINE: OBJECT |--------------------------//
//----------------------------------------------------------------------------//
(() => {
   class CSENGINE_OBJECT {
      constructor(cs) {
         this.cs = cs
         this.list = [] // all objects
         this.new = [] // newly added objects
         this.unique = 0
         this.types = {}
         this.objGroups = {}
         this.shouldClean = false
      }

      loop(call) {
         var i = this.cs.object.list.length;
         while (i--) {
            var object = this.cs.object.list[i]
            call(object)
         }
      }

      create(options) {
         if (!this.cs.objects[options.type]) {
            console.log('object type "' + options.type + '" does not exist')
            return undefined
         }

         var attr = options.attr
         var template = this.cs.objects[options.type]
         var zIndex = options.zIndex || template.zIndex || 0

         // create the object
         var newObj = {
            core: {
               zIndex: zIndex,
               live: true,
               active: true,
               drawn: false,
               type: options.type,
               id: this.unique,
               surface: this.cs.default(template.surface, 'game')
            }
         }

         // predefined / custom Attr
         for (var name in template.attr) { newObj[name] = template.attr[name] }
         for (var name in attr) { newObj[name] = attr[name] }

         // run create event
         template.create && template.create.call(newObj, { object: newObj, cs: this.cs });

         // add to list
         this.new.push({ obj: newObj, zIndex: zIndex })
         this.unique += 1

         // grouping
         if (!this.objGroups[options.type]) this.objGroups[options.type] = []
         this.objGroups[options.type].push(newObj)

         return newObj
      }

      addNewObjects() {
         while (this.new.length) {
            var obj = this.new.shift().obj
            this.list.push(obj)
         }

         this.orderObjectsByZIndex()
      }

      orderObjectsByZIndex() {
         this.order = this.list.sort(function(a, b) {
            return b.core.zIndex === a.core.zIndex
               ? b.core.id - a.core.id
               : b.core.zIndex - a.core.zIndex
         })
      }

      changeZIndex(object, zIndex) {
         var listObject = object.list.find(function(listObject) {
            return listObject.obj.core.id == object.core.id
         })

         listObject.core.zIndex = zIndex

         this.orderObjectsByZIndex()
      }

      destroy(destroyObjOrID, fadeTimer) {
         this.shouldClean = true
         var destroyObj = (typeof destroyObjOrID === 'number')
            ? this.id(destroyObjOrID)
            : destroyObjOrID

         destroyObj.core.live = false
         destroyObj.core.active = false
         destroyObj.core.fadeTimer = fadeTimer || 0

         // remove from objGroup
         var type = destroyObj.core.type
         if (this.cs.objects[type].destroy) {
            this.cs.objects[type].destroy.call(destroyObj, { object: destroyObj, cs: this.cs })
         }
         this.objGroups[type] = this.objGroups[type].filter(function(obj) { return obj.core.live })
      }

      clean() {
         if(!this.shouldClean) return
         this.list = this.list.reduce(function(sum, num) {
            if(num.core.live) sum.push(num)
            return sum
         }, [])
      }

      every() {
         return this.list.concat(this.new.map(function(obj) { return obj.obj }))
      }

      all(type) {
         return this.objGroups[type] || []
      }

      find(type) {
         if (!this.objGroups[type]) {
            return undefined
         }
         return this.objGroups[type][0]
      }

      search(call) {
         return this.every().find(function(obj) {
            if (!obj.core.live) return false
            return call(obj)
         })
      }

      id(id) {
         return this.list.find(function(obj) { return obj.core.id === id })
      }

      count(type) {
         return this.objGroups[type] ? this.objGroups[type].length : 0
      }

      reset() {
         this.list = []
         this.new = []
         this.objGroups = {}
         this.unique = 0
      }

      resize() {
         for (var object of this.list) {
            object.core.drawn = false
         }
      }
   }

   // export (node / web)
   typeof module !== 'undefined'
      ? module.exports = CSENGINE_OBJECT
      : cs.object = new CSENGINE_OBJECT(cs)
})()
