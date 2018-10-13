cs.objects['obj_block'] = {
   create: function() {
      this.sprite = 'spr_block'
      this.mask = { x: 0, y: 0, width: 16, height: 16 }
   },
   step: function() {
      cs.draw.sprite({ spr: this.sprite, x: this.x, y: this.y })
   }
}
