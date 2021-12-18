/* eslint-disable id-length */

import degToRad from "deg2rad"

export default (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = degToRad(angleInDegrees)

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  }
}
