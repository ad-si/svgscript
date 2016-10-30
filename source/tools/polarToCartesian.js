/* eslint-disable id-length */
const degToRad = require('deg2rad')

module.exports = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = degToRad(angleInDegrees)

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  }
}
