/* global cs, testUtility */

testUtility.test({
   collapse: true,
   title: "cs.math",
   tests: [
      {
         name: 'sign',
         should: 'return a numbers sign -1, 0, or 1',
         pass: function(pass, fail) {
            return (
               cs.math.sign(-1) === -1
               && cs.math.sign(-100) === -1
               && cs.math.sign(1) === 1
               && cs.math.sign(100) === 1
               && cs.math.sign(0) === 0
            ) ? pass() : fail()
         }
      },
      {
         name: 'outside',
         should: 'returns if num is outside two numbers',
         pass: function(pass, fail) {
            return (
               cs.math.isOutside(1, 0, 0)
               && !cs.math.isOutside(1, 0, 1)
               && !cs.math.isOutside(100, 100, 0)
               && !cs.math.isOutside(-1, -10, 0)
               && cs.math.isOutside(100, 0, 99)
               && cs.math.isOutside(-10, 0, 99)
            ) ? pass() : fail()
         }
      },
      {
         name: 'between',
         should: 'returns num is between two numbers',
         pass: function(pass, fail) {
            return (!cs.math.isBetween(1, 0, 0)
               && cs.math.isBetween(1, 0, 1)
               && cs.math.isBetween(100, 100, 0)
               && cs.math.isBetween(-1, -10, 0)
               && !cs.math.isBetween(100, 0, 99)
               && !cs.math.isBetween(-10, 0, 99)
            ) ? pass() : fail()
         }
      },
      {
         name: 'constrain',
         should: 'contrains a number between a min and max',
         pass: function(pass, fail) {
            return (cs.math.constrain(1, 0, 1) === 1
               && cs.math.constrain(1, 1, 0) === 1
               && cs.math.constrain(100, 0, 1) === 1
               && cs.math.constrain(100, 1, 0) === 1
               && cs.math.constrain(-100, 0, 1) === 0
               && cs.math.constrain(-100, 1, 0) === 0
            ) ? pass() : fail()
         }
      },
      {
         name: 'iRandomRange',
         should: 'returns a random integer between a min and max',
         pass: function(pass, fail) {
            var checks = [
               { min: 10, max: 20 },
               { min: -10, max: 20 },
               { min: -100, max: 100 }
            ]

            for (var i = 0; i < 100; i++) {
               for (var check of checks) {
                  var checkRange = cs.math.iRandomRange(check.min, check.max)

               }
               if (checkRange < check.min || checkRange > check.max) {
                  return fail()
               }
            }

            return pass()
         }
      },
      {
         name: 'choose',
         should: 'return a random choice from an array',
         pass: function(pass, fail) {
            var choices = ['one', 'two', 'three']
            var choosen = []

            // going to add results to choosen array
            for (var i = 0; i < 100; i++) {
               var choice = cs.math.choose(choices)
               if (choosen.indexOf(choice) < 0) choosen.push(choice)
            }

            // then make sure all choices have been made
            return choices.length === choosen.length ? pass() : fail()
         }
      },
      {
         name: 'brakingDistance',
         should: 'return amount of distance it would take to stop a speed by a friction',
         pass: function(pass, fail) {
            var checks = [
               { speed: 10, friction: 0.9, distanceShouldBe: 90.00000000000001 },
               { speed: 10, friction: 0.5, distanceShouldBe: 10 },
               { speed: 10, friction: 0.1, distanceShouldBe: 1.1111111111111112 },
               { speed: 1, friction: 0.9, distanceShouldBe: 9.000000000000002 },
               { speed: 1, friction: 0.1, distanceShouldBe: 0.11111111111111112 },
            ]

            for (var check of checks) {
               if (cs.math.brakingDistance(check) !== check.distanceShouldBe) return fail()
            }

            return pass()
         }
      },
      {
         name: 'requiredSpeed',
         should: 'return the required speed to get through friction to go a distance',
         pass: function(pass, fail) {
            var checks = [
               { distance: 10, friction: 0.9, distanceShouldBe: 4.242640687119285 },
               { distance: 10, friction: 0.5, distanceShouldBe: 3.1622776601683795 },
               { distance: 10, friction: 0.1, distanceShouldBe: 1.4142135623730951 },
               { distance: 1, friction: 0.9, distanceShouldBe: 1.3416407864998738 },
               { distance: 1, friction: 0.1, distanceShouldBe: 0.4472135954999579 },
            ]

            for (var check of checks) {
               if (cs.math.requiredSpeed(check) !== check.distanceShouldBe) return fail()
            }

            return pass()
         }
      },
      {
         name: 'inRange',
         should: 'return true/false is number is between a range',
         pass: function(pass, fail) {
            var checks = [
               { min: 0, max: 10, num: 1, shouldBe: true },
               { min: -10, max: 10, num: 1, shouldBe: true },
               { min: 0, max: 10, num: -1, shouldBe: false },
               { min: 0, max: 10, num: 11, shouldBe: false }
            ]

            for (var check of checks) {
               if (cs.math.inRange(check) !== check.shouldBe) return fail()
            }

            return pass()
         }
      },
      {
         name: 'circular',
         should: 'keep the number between the start and end',
         pass: function(pass, fail) {
            const checks = [
               { num: 20, start: 0, end: 100, shouldBe: 20 }, // no change
               { num: -20, start: 0, end: 100, shouldBe: 80 }, // under
               { num: 120, start: 0, end: 100, shouldBe: 20 }, // over
               { num: 999, start: 0, end: 100, shouldBe: 99 }, // way over
               { num: -999, start: 0, end: 100, shouldBe: 1 }, // way under
            ]

            for (const check of checks) {
               const val = cs.math.circular(check.num, check.start, check.end)
               if (val !== check.shouldBe) {
                  fail(`cs.math.circular(${check.num}, ${check.start}, ${check.end}) returned ${val}`)
               }
            }

            return pass()
         }
      }
   ]
})
