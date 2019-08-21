// -------------------------------------------------------------------------- //
// ----------------------------| CS ENGINE: DESTROY |------------------------ //
// -------------------------------------------------------------------------- //

(() => {
   const CSENGINE_DESTROY = function() {
      console.log('cs-engine destroying')
      this.loop.stop()
   }

   // export (node / web)
   if (typeof module !== 'undefined') module.exports = CSENGINE_DESTROY
   else cs.destroy = CSENGINE_DESTROY // eslint-disable-line no-undef
})()
