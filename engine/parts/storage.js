//---------------------------------------------------------------------------------------------//
//----------------------------------| Storage Functions |--------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.storage = {
   load: function(info){
      var that = this
      var name = info.path.split('/').pop()
      var ajax = new XMLHttpRequest()
      cs.load.add()
      ajax.onreadystatechange = function() {
         if(this.readyState == 4){
            var data = JSON.parse(this.responseText)
            if(info.group && !that[info.group]) that[info.group] = {}

            info.group
               ? that[info.group][info.name] = data
               : that[info.name] = data

            cs.load.check()
         }
      }
      ajax.open("POST", `./${info.path}.json`, true)
      ajax.send()
   },
   cache: function(){
      //we could cache something to local storage here
   }
}
