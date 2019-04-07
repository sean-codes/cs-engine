const cos = (angleInDegrees) => {
   return Math.cos((angleInDegrees-90) * Math.PI/180)
}

const sin = (angleInDegrees) => {
   return Math.sin((angleInDegrees-90) * Math.PI/180)
}

module.exports = {
   cos,
   sin
}
