cs.objects['obj_block'] = {
   sprite: 'spr_block',
   width:16,
   height: 16,
   create: function(){

   },
   step: function(){
      cs.draw.sprite(this.sprite, this.x, this.y);
   }
}
