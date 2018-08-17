//----------------------------------------------------------------------------//
//----------------------------------| Storage Functions |---------------------//
//----------------------------------------------------------------------------//
cs.storage = {
   data: {},
   init: function(){
      for(var storage of cs.storages){
         this.write(storage)
      }
   },
   read: function(location) {
      return JSON.parse(this.data[location])
   },
   write: function(options) {
      this.data[options.location] = JSON.stringify(options.data)
   },
	search: function(location) {
		var list = []
		for(var storageName of Object.keys(this.data)){
			if(storageName.startsWith(location)){
				list.push(storageName)
			}
		}
		return list
	},
	cache: function() {
      //we could cache something to local storage here
   }
}
