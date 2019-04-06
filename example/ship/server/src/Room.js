const Ship = require('./Ship')

module.exports = class Room {
   constructor() {
      console.log('Room created!')
      this.ships = []

      this.width = 500
      this.height = 500

      setTimeout(() => this.step())
   }

   step() {
      setTimeout(() => this.step(), 1000/60)

      for (var ship of this.ships) {
         ship.update()
      }

      // this.change()
   }

   addShip(ws) {
      console.log('Adding Ship to room')
      const id = Math.round(Date.now() * Math.random() * 100000)
      const newShip = new Ship(id, ws, this)
      this.ships.push(newShip)

      for (var ship of this.ships) {
         ship.send({
            func: 'newShip',
            data: {
               id: newShip.id,
               x: newShip.x,
               y: newShip.y,
               direction: newShip.direction
            }
         })

         if (newShip.id !== ship.id) {
            newShip.send({
               func: 'newShip',
               data: {
                  id: ship.id,
                  x: ship.x,
                  y: ship.y,
                  direction: ship.direction
               }
            })
         }
      }

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
   }

   change() {
      var ships = this.ships.map((ship) => {
         return {
            id: ship.id,
            keys: ship.keys,
            x: ship.x,
            y: ship.y,
            direction: ship.direction,
            turnSpeed: ship.turnSpeed,
            xSpeed: ship.xSpeed,
            ySpeed: ship.ySpeed,
            sent: Date.now()
         }
      })

      for (var ship of this.ships) {
         // console.log(ships)
         ship.send({
            func: 'change',
            data: {
               ships: ships
            }
         })
      }
      // console.log('emmitting room')
   }
}
