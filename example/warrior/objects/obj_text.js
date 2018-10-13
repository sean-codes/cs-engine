cs.objects['obj_text'] = {
   create: function() {
      this.text = ''
      this.timer = { time: 60, total: 60 }
      this.color = '#FFF'
      this.vspeed = -1
      this.hspeed = 0
   },
   step: function() {
      this.x += this.hspeed
      this.y += this.vspeed

      cs.draw.setAlpha(this.timer.time / this.timer.total)
      cs.draw.setTextCenter()
      cs.draw.text(this.x, this.y, this.text)


      this.timer.time -= 1
      if (this.timer.time == 0)
         cs.obj.destroy(this)
   }
}
