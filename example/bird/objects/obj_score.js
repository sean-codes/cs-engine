cs.objects['obj_score'] = {
   create: function() {
      this.mask = { x: 0, y: 0, width: 2, height: 40 }
      this.hspeed = 1;
   },
   step: function() {
      this.x -= this.hspeed;
   }
}

cs.objects['obj_score_text'] = {
   zIndex: 21,
   create: function() {
      this.text = cs.math.choose([
         '+1 Nice dive!',
         '+1 Daredevil!',
         '+1 Dangerous!',
         '+1 Holy Smokes!'
      ]);
      this.timer = 60;
   },
   step: function() {
      this.y -= 1;
      this.x -= cs.global.speed;
      this.timer -= 1;

      cs.draw.setTextCenter();
      cs.draw.setColor('#FFF38E');
      cs.draw.setFont({ effect: 'bold', size: 8, family: 'monospace'})
      cs.draw.text({ x: this.x, y: this.y, text: this.text })

      if (this.timer == 0) {
         cs.object.destroy(this);
      }
   }
}
