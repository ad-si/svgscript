const clone = require('clone')
const rad2deg = require('rad2deg')
const deg2rad = require('deg2rad')
const SvgPath = require('svgpath')

const rgba = require('./rgba.js')
const formatSvg = require('./formatSvg')
const circleSection = require('./circleSection')


module.exports = {
  rgb: rgba,
  rgba,
  clone,
  degToRad: deg2rad,
  radToDeg: rad2deg,
  optimizePath: (path) =>
    new SvgPath(path)
      .round(0)
      .toString(),
  optimizePathAbsolute: (path) =>
    new SvgPath(path)
      .abs()
      .round(0)
      .toString(),
  optimizePathRelative: (path) =>
    new SvgPath(path)
      .abs()
      .round(0)
      .rel()
      .round(0)
      .toString(),
  circleSection,
  formatSvg,
}
