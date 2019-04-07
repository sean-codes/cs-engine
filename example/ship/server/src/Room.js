const Ship = require('./Ship')
const Bullet = require('./Bullet')

module.exports = class Room {
   constructor() {
      console.log('Room created!')
      this.ships = []
      this.bullets = []

      this.width = 500
      this.height = 500
      this.respawnTime = 180
      this.howLongAGameLasts = 60 * 30
      this.howLongWaitForNewGame = 60 * 10

      this.timeLeft = 0 // 3 minutes
      this.timeNewGame = this.howLongWaitForNewGame

      setTimeout(() => this.step())
   }

   step() {
      setTimeout(() => this.step(), 1000/60)

      if (this.timeLeft) {
         this.timeLeft -= 1
         if (!this.timeLeft) {
            console.log('end game')
            this.timeNewGame = 60 * 5
            this.sendGameState()
         }
      }

      if (this.timeNewGame) {
         this.timeNewGame -= 1
         if (!this.timeNewGame) {
            console.log('new game')
            this.timeLeft = this.howLongAGameLasts
            this.startNewGame()
            this.sendGameState()
         }
      }


      for (var ship of this.ships) {
         ship.update()
      }

      // turn bullets off in wait screen
      if (!this.timeNewGame) {
         for (var bullet of this.bullets) {
            bullet.update()

            // check collision with player
            for (var ship of this.ships) {
               if (ship.id == bullet.ship.id) continue

               var xOff = ship.x - bullet.x
               var yOff = ship.y - bullet.y
               var distance = Math.sqrt(xOff * xOff + yOff * yOff)

               if (distance < 10) {
                  this.broadcast({
                     func: 'hitShip',
                     data: {
                        id: ship.id,
                        respawnTime: this.respawnTime
                     }
                  })
                  bullet.ship.score += 1
                  ship.respawnTime = this.respawnTime
                  this.destroyBullet(bullet)
                  this.sendGameState()
                  break
               }
            }
         }
      }
   }

   startNewGame() {
      for (var ship of this.ships) {
         ship.score = 0
         ship.respawn()
      }
   }

   sendGameState() {
      this.broadcast({
         func: 'gamestate',
         data: {
            score: this.getScoreboard(),
            timeLeft: this.timeLeft,
            timeNewGame: this.timeNewGame
         }
      })
   }

   getScoreboard() {
      var score = []
      this.activeShips((ship) => {
         score.push({
            name: ship.name,
            score: ship.score,
            id: ship.id
         })
      })

      return score.sort((a, b) => b.score - a.score) || []
   }

   addShip(ws) {
      console.log('Adding Ship to room')

      const newShip = new Ship(ws, this)
      this.ships.push(newShip)

      this.activeShips((ship) => {
         newShip.send({
            func: 'newShip',
            data: {
               id: ship.id,
               name: ship.name,
               x: ship.x,
               y: ship.y,
               direction: ship.direction
            }
         })
      })
   }

   shipStart(newShip) {
      this.sendGameState()
      this.allShips((ship) => {
         ship.send({
            func: 'newShip',
            data: {
               id: newShip.id,
               name: newShip.name,
               x: newShip.x,
               y: newShip.y,
               direction: newShip.direction
            }
         })
      })
   }

   destroyShip(destroyShip) {
      console.log('destroying ship', destroyShip.id)
      this.ships = this.ships.filter((ship) => {
         return ship.id !== destroyShip.id
      })

      for (var ship of this.ships) {
         ship.send({
            func: 'destroyShip',
            data: {
               id: destroyShip.id
            }
         })
      }

      this.sendGameState()
   }

   addBullet(ship) {
      const newBullet = new Bullet(ship, this)
      this.bullets.push(newBullet)
      for (var ship of this.ships) {
         ship.send({
            func: 'bullet',
            data: {
               x: newBullet.x,
               y: newBullet.y,
               direction: newBullet.direction,
               id: newBullet.id
            }
         })
      }
   }

   destroyBullet(destroyBullet) {
      this.bullets = this.bullets.filter((bullet) => {
         return bullet.id != destroyBullet.id
      })

      for (var ship of this.ships) {
         ship.send({
            func: 'destroyBullet',
            data: {
               id: destroyBullet.id
            }
         })
      }
   }

   broadcast(message) {
      for (var ship of this.ships) {
         ship.send(message)
      }
   }

   activeShips(func) {
      for (var ship of this.ships) {
         if (!ship.start) continue
         func(ship)
      }
   }

   allShips(func) {
      for (var ship of this.ships) {
         func(ship)
      }
   }
}
