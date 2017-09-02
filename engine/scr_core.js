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
   path: document.getElementById('cs-core').src+'/..',
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
   init: function(info){
      // When finished loading
      this.canvas = info.canvas
      this.start = info.start
      for(var part of this.parts){
         part.path = this.path +'/parts/'+ part.path
      }
      this.sprites = info.sprites
      this.loadScripts(this.parts.concat(info.scripts))
   },
   loadScripts: function(files){
      this.loading += files.length
      for(var file of files){
         this.load(file.path)
      }
   },
   load: function(part){
      var that = this
      var script = document.createElement('script')
      script.src = part+'.js'
      script.onload = function() { that.onload() }
      document.head.appendChild(script)
   },
   onload: function(){
      this.loading -= 1
      console.log(this.loading)
      if(!this.loading && this.start){
         cs.sprite.load(this.sprites)
      }
   }
}
