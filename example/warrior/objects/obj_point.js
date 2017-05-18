cs.objects['obj_point'] = {
   create: function(){

   },
   step: function(){
      cs.draw.circle(this.x, this.y, 5, false)
      cs.draw.circleGradient(this.x, this.y, 5)

   }
}
