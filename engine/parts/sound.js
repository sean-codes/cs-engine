//---------------------------------------------------------------------------------------------//
//-----------------------------------| Sound Functions |---------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.sound = {
   list: {},
   playList: [],
   context: undefined,
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
   },
   init: function(){
      this.list = {};
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      if(window.AudioContext){
         this.context = new AudioContext()
         this.canPlayAudio = true
      }
      this.loadSounds()
   },
   loadSounds: function(){
      for(var sound of cs.sounds){
         var name = sound.path.split('/').pop()
         this.list[name] = sound
      }
   },
   play: function(audioName, options){
      var sound = this.list[audioName]
      if(this.canPlayAudio && sound){
         this.playList.forEach(function(audioObj){
            if(audioObj.name == audioName){
               //console.log('Reuse this sound');
            }
         })
         var csAudioObj = this.context.createBufferSource();
         csAudioObj.name = audioName;
         csAudioObj.buffer = sound.buffer;
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
