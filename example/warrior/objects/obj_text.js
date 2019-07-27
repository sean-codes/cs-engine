cs.objects['obj_text'] = {
   create: ({ object, cs }) => {
      this.text = ''
      this.timer = { time: 60, total: 60 }
      this.color = '#FFF'
      this.vspeed = -1
      this.hspeed = 0
   },
   
   draw: ({ object, cs }) => {
      this.x += this.hspeed
      this.y += this.vspeed

      cs.draw.setAlpha(this.timer.time / this.timer.total)
      cs.draw.setTextCenter()
      cs.draw.text(this.x, this.y, this.text)


      this.timer.time -= 1
      if (this.timer.time == 0)
         cs.object.destroy(this)
   }
}
