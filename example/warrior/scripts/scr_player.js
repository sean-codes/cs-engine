cs.script.player = {
   attack: function(player){

      var weapon = 'sword'
      var weaponSprite = cs.sprite.list['spr_' + weapon]
      var weaponDamage = 4

      //If sprite is wider use the width as range
      var weaponRange = (weaponSprite.fwidth > weaponSprite.fheight)
         ? weaponSprite.fwidth
         : weaponSprite.fheight

      //Check if hit enemy
      var hitEnemy = cs.script.collideRect('obj_blob', {
         x: (player.dir == 1) ? player.x + player.width : player.x - weaponRange,
         y: player.y,
         width: weaponRange,
         height: player.height
      })

      if(hitEnemy && hitEnemy.hit.timer == 0){
         hitEnemy.hit = {
            timer: 30,
            timerLength: 30
         }
         hitEnemy.health.value -= weaponDamage
         hitEnemy.hspeed = Math.sign((hitEnemy.x + hitEnemy.width/2) - (player.x+player.width/2))*10
         hitEnemy.vspeed = -4

         var dmgObject = cs.obj.create('obj_text', hitEnemy.x+hitEnemy.width/2, hitEnemy.y)
         dmgObject.text = weaponDamage
      }
   }
}
