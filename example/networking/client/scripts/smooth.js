// prevents rapid snapping!
// it can allow for non exact syncing! :<
cs.scripts.smooth = (from, to, speed) => {
   var diff = to - from

   // to much lets use the to
   if (Math.abs(diff) > 50) {
      return to
   }

   // i smooth at some rate
   if (Math.abs(diff) > 0.5) {
      return from + diff * (Math.abs(diff) / cs.default(speed, 100))
   }

   // its fine :]
   return from
}
