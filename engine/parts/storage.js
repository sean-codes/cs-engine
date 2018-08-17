//----------------------------------------------------------------------------//
//----------------------------------| Storage Functions |---------------------//
//----------------------------------------------------------------------------//
cs.storage = {
   data: {},
   init: function(){
      for(var storage of cs.storages){
         this.set(storage)
      }
   },
	set: function(storage) {
		this.data[storage.name] = JSON.stringify(storage.data)
	},
   read: function(name) {
      return JSON.parse(this.data[name])
   },
   write: function(info) {
      this.data[info.location] = info.data
   },
	search: function(search) {
		var list = []
		for(var storageName of Object.keys(this.data)){
			if(storageName.startsWith(search)){
				list.push(storageName)
			}
		}
		return list
	},
	cache: function() {
      //we could cache something to local storage here
   }
}
