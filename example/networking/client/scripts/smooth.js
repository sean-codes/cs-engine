/* global cs */

// prevents rapid snapping!
// it can allow for non exact syncing! :<
cs.script.smooth = (from, to, speed) => {
   var diff = to - from

   // to much lets use the to
   if (Math.abs(diff) > 10) {
      return to
   }

   // i smooth at some rate
   if (Math.abs(diff) > 0.25) {
      return from + diff * (Math.abs(diff) / cs.default(speed, 100))
   }

   // its fine :]
   return from
}
