const {
   sin,
   cos
} = require('./math')

module.exports = class Bullet {
   constructor(ship, room) {
      this.room = room
      this.ship = ship
      
      this.id = Math.round(Date.now() * Math.random() * 100000)
      this.x = ship.x
      this.y = ship.y
      this.direction = ship.direction
      this.speed = 3

      this.life = 60
   }

   update() {
      this.x += cos(this.direction) * this.speed
      this.y += sin(this.direction) * this.speed

      this.life -= 1
      if (!this.life) {
         this.room.destroyBullet(this)
      }
   }
}
