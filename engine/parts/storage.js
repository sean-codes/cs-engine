//---------------------------------------------------------------------------------------------//
//----------------------------------| Storage Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.storage = {
   data: {},
   init: function(){
      for(var storage of cs.storages){
         this.data[storage.name] = storage.data
      }
   },
   cache: function(){
      //we could cache something to local storage here
   },
   group: function(groupName){
      var group = []
      for(var storageName of Object.keys(this.data)){
         if(storageName.startsWith(groupName)){
            group.push(storageName)
         }
      }
      return group
   },
   read: function(name){
      return this.data[name]
   },
   write: function(info){
      this.data[info.location] = info.data
   }
}
