cs.objects['obj_building'] = {
   width: 62,
   height: 48,
   sprite: 'spr_building',
   create: function(){},
   step: function(){
      cs.draw.sprite(this.sprite, this.x, this.y)
   }
}
