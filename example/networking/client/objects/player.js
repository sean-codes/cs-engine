cs.objects.player = {
   create: function() {
      this.networkId = this.networkId

      this.pos = this.pos
      this.speed = 0
      this.angle = 0
      this.radius = 3

      this.timeline = {
         snapshots: [],
         curr: 0,
         time: 0,
         last: Date.now()
      }

      // read intial snapshot
      this.snapshot && this.read(this.snapshot)
   },

   read: function(snapshot) {
      this.networkId = snapshot.id

      if (!this.timeline.snapshots.length) {
         this.pos = cs.vector.create(snapshot.x, snapshot.y)
         this.speed = snapshot.s
         this.angle = snapshot.a
         this.turnSpeed = snapshot.t
         this.timeline.time = Date.now()
      }

      var lastSnapshot = this.timeline.snapshots[this.timeline.snapshots.length - 1]
      var frametime = lastSnapshot ? Date.now() - lastSnapshot.time : 100

      this.timeline.totalTime += frametime
      this.timeline.snapshots.push({
         pos: cs.vector.create(snapshot.x, snapshot.y),
         speed: snapshot.s,
         angle: snapshot.a,
         now: Date.now(),
         time: this.timeline.time + frametime,
         frameTime: frametime
      })

   },

   step: function() {
      // we have an array of snapshots
      // 1. find the first and last snapshot
      var currSnapshot = this.timeline.snapshots[this.timeline.curr]
      var nextSnapshot = this.timeline.snapshots[this.timeline.snapshots.length - 1]

      // find the difference between curr and next
      var timeDifference = nextSnapshot.time - currSnapshot.time

      // where are we in this?
      // var percent =
      console.log('timeDifference', timeDifference, this.timeline.curr)

      // update time
      var now = Date.now()
      var timePassed = now - this.timeline.last
      this.timeline.last = now
      this.timeline.time += timePassed

      if (this.timeline.time > currSnapshot.time) {
         this.timeline.curr = Math.min(this.timeline.curr + 1, this.timeline.snapshots.length-1)
      }
   },

   draw: function() {
      cs.draw.setColor('#39D')
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius, fill: true })

      cs.draw.setColor('#FFF')
      cs.draw.setWidth(0.5)
      cs.draw.circle({ x: this.pos.x, y: this.pos.y, radius: this.radius })

      // draw direction
      var dirPoint = {
         x: this.pos.x + cs.math.cos(this.angle) * this.radius,
         y: this.pos.y + cs.math.sin(this.angle) * this.radius
      }

      cs.draw.setWidth(0.5)
      cs.draw.setColor('#FFF')
      cs.draw.line({
         points: [{ x: this.pos.x, y: this.pos.y }, dirPoint ]
      })
   }
}
