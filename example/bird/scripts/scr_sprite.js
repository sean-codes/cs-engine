cs.script.setSprite = function(that, spriteName){
    that.sprite = spriteName;
    that.width = cs.sprite.list[spriteName].fwidth;
    that.height = cs.sprite.list[spriteName].fheight;
    that.xoff = cs.sprite.list[spriteName].xoff;
    that.yoff = cs.sprite.list[spriteName].yoff;
}
