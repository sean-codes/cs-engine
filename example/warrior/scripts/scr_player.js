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
         x: player.x,
         y: player.y,
         width: weaponRange,
         height: player.height
      })

      if(hitEnemy)
         console.log('yay you hit something!')
   }
}
