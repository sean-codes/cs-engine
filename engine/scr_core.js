//Name Space
var cs = {};
//---------------------------------------------------------------------------------------------//
//-----------------------------| Global Variables and Scripts |--------------------------------//
//---------------------------------------------------------------------------------------------//
cs.global = {}
cs.script = {}
cs.save = {}
cs.objects = {}
cs.sprites = {}

//---------------------------------------------------------------------------------------------//
//------------------------------------| Core Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.core = {
   loading: 0,
   parts: [
      { path: 'camera' },
      { path: 'draw' },
      { path: 'fps' },
      { path: 'init' },
      { path: 'input' },
      { path: 'keys' },
      { path: 'load' },
      { path: 'loop' },
      { path: 'math' },
      { path: 'mouse' },
      { path: 'network' },
      { path: 'object' },
      { path: 'particle' },
      { path: 'room' },
      { path: 'sound' },
      { path: 'sprite' },
      { path: 'storage' },
      { path: 'surface' },
      { path: 'touch' }
   ],
   init: function(path){
      for(var part of this.parts){
         part.path = path +'/parts/'+ part.path
      }
      this.loadScripts(this.parts)
   },
   loadScripts: function(files){
      for(var file of files){
         this.load(file.path)
      }
   },
   load: function(part){
      this.loading += 1
      console.log(this.loading)
      var that = this
      var script = document.createElement('script')
      script.src = part+'.js'
      script.onload = function() { that.loaded() }
      document.head.appendChild(script)
   },
   loaded: function(){
      this.loading -= 1
      if(!this.loading){
         console.log('wtf')
      }
   }
}
