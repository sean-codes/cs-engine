cs.script.interface = {}
cs.script.interface.drawButton = function(bx, by, bw, bh, text) {
   cs.draw.setAlpha(0.6)
   cs.draw.rect(bx, by, bw, bh, true)
   cs.draw.setWidth(3)
   cs.draw.rect(bx - 1, by - 1, bw + 2, bh + 2, false)

   cs.draw.setColor('#FFFFFF');
   cs.draw.setTextCenter();
   cs.draw.setFont({ size: 18, family: 'Arial' })
   cs.draw.text(cs.draw.surface.width / 2, by + bh / 2, text);
}

cs.script.interface.drawButtons = function(btns) {
   var btnHeight = 150
   var btnWidth = 300
   var totalHeight = cs.draw.surface.height
   var totalButtonHeight = btnHeight * btns.length

   if (totalButtonHeight > totalHeight)
      totalButtonHeight = totalHeight

   var btnHeight = totalButtonHeight / btns.length
   var dy = Math.floor(cs.draw.surface.height / 2 - (totalButtonHeight) / 2)
   var dx = Math.floor(cs.draw.surface.width / 2 - btnWidth / 2)
   var space = 20
   for (var btn of btns) {
      var btnRect = {
         x: dx,
         y: dy + space / 2,
         width: btnWidth,
         height: btnHeight - space
      }
      cs.draw.setColor('#000')
      cs.draw.setAlpha(0.75)
      cs.draw.fillRect(btnRect)
      cs.draw.setWidth(3)
      cs.draw.setColor('#FFF')
      cs.draw.strokeRect(btnRect)
      cs.draw.setTextCenter()
      cs.draw.setColor('#FFF')
      cs.draw.setFont({ size: 20, family: 'monospace', effect: 'bold' })
      cs.draw.text({
         x: dx + btnWidth / 2,
         y: dy + btnHeight / 2,
         text: btn
      })
      dy += btnHeight
   }
}
