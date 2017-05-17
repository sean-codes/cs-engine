cs.script.player = {
   attack: function(player){

      var weapon = 'sword'
      var weaponSprite = cs.sprite.list['spr_' + weapon]

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

      if(hitEnemy && !hitEnemy.hit.toggle){
         hitEnemy.hit = {
            toggle: true,
            timer: 0,
            timerLength: 60
         }
         hitEnemy.hspeed = Math.sign((hitEnemy.x + hitEnemy.width/2) - (player.x+player.width/2))*10
         hitEnemy.vspeed = -4
      }
   }
}
