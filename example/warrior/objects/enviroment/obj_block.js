cs.objects['obj_block'] = {
   create: function(){
      this.sprite = 'spr_block'
      this.width = 16
      this.height = 16
   },
   step: function(){
      cs.draw.sprite({ spr:this.sprite, x:this.x, y:this.y })
   }
}
