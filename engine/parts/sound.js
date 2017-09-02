//---------------------------------------------------------------------------------------------//
//-----------------------------------| Sound Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.sound = {
   list: {},
   playList: [],
   context: null,
   canPlayAudio: false,
   mute: false,
   active: true,
   volume : undefined,
   enable: function(){
      if(this.canPlayAudio === true || !this.context) return;

      var source = this.context.createBufferSource();
      source.buffer = this.context.createBuffer(1, 1, 22050);
      source.connect(this.context.destination);
      source.start(0);
      this.canPlayAudio = true;
   },
   init: function(){
      this.list = {};
      try {
         window.AudioContext =
         window.AudioContext || window.webkitAudioContext;
         this.context = new AudioContext();
      } catch (e) {
         this.context = undefined;
         this.canPlayAudio = false;
         alert('Web Audio API is not supported in this browser');
      }
   },
   load: function(options){
      var pathSplit = options.path.split('/');
      var name = pathSplit.pop();
      var path = pathSplit.toString('/');
      var types = (options.extension ? options.extension : 'wav').split(',');

      this.list[name] = {};
      for(var i in types){
         var type = types[i].trim();
         this.list[name][type] = {
            loaded: false,
            path : path
            + '/' + name
            + '.' + type,
            buffer: null,
            request: new XMLHttpRequest()
         }

         this.list[name][type].request.csData = { name: name, type: type }
         this.list[name][type].request.open('GET', this.list[name][type].path, true);
         this.list[name][type].request.responseType = 'arraybuffer';

         this.list[name][type].request.onload = function(){
            var name = this.csData.name;
            var type = this.csData.type;
            cs.sound.context.decodeAudioData(this.response, function(buffer){
               cs.sound.list[name][type].buffer = buffer;
               cs.sound.list[name][type].loaded = true;
            });
         }
         cs.sound.list[name][type].request.send();
      }
   },
   play: functionplay = function(audioName, options){
      if(this.list[audioName]['wav'].loaded === true){
         this.playList.forEach(function(audioObj){
            if(audioObj.name == audioName){
               //console.log('Reuse this sound');
            }
         })
         var csAudioObj = this.context.createBufferSource();
         csAudioObj.name = audioName;
         csAudioObj.buffer = this.list[audioName]['wav'].buffer;
         for(var opt in options){ csAudioObj[opt] = options[opt] }
         csAudioObj.gainNode = this.context.createGain();
         csAudioObj.connect(csAudioObj.gainNode);
         csAudioObj.gainNode.connect(this.context.destination);
         csAudioObj.gainNode.gain.value = cs.sound.mute ? 0 : 1;
         csAudioObj.start(0);
         this.playList.push(csAudioObj);
         return csAudioObj;
      }
      return undefined;
   },
   reset: function(){
      for(var sound in this.playList){
         //TODO there is an error here take a look in a second I got to go wash my cloths~!!!
         if(!this.playList) return;
         this.playList[sound].stop();
         this.playList[sound].disconnect();
      }
   },
   toggleMute: function(bool){
      this.mute = bool;
      (bool) ? this.setGain(0) : this.setGain(1);
   },
   setGain: function(gainValue){
      console.log('GainValue: ' + gainValue);
      for(var audioObj in this.playList){
         console.log('Muting...', audioObj);
         this.playList[audioObj].gainNode.gain.value = gainValue;
      }
   },
   toggleActive: function(bool){
      if(this.context)
         (bool) ? this.context.resume() : this.context.suspend();
   }
}
