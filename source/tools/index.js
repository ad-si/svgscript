const clone = require('clone')
const deg2rad = require('deg2rad')
const rad2deg = require('rad2deg')
const SvgPath = require('svgpath')
const CleanCSS = require('clean-css')
const cssobjCore = require('cssobj-core')
const cssobjPluginGencss = require('cssobj-plugin-gencss')

const rgb = require('./rgb.js')
const rgba = require('./rgba.js')
const formatSvg = require('./formatSvg')
const circleSection = require('./circleSection')
const arrangeAsGrid = require('./arrangeAsGrid')
const businessCard = require('./businessCard')


function optimizePath (path) {
  return new SvgPath(path)
    .round(0)
    .toString()
}

function optimizePathAbsolute (path) {
  return new SvgPath(path)
    .abs()
    .round(0)
    .toString()
}

function optimizePathRelative (path) {
  return new SvgPath(path)
    .abs()
    .round(0)
    .rel()
    .round(0)
    .toString()
}

function cssobjToCss (options = {}) {
  const {
    styleObject,
    minified,
    // scoped,
  } = options
  let {
    indentation = '  ',
    endOfLine = '\n',
  } = options

  if (minified) {
    indentation = ''
    endOfLine = ''
  }

  const getInstance = cssobjCore({
    plugins: [ // Order is important
      cssobjPluginGencss({
        indent: indentation,
        newLine: endOfLine,
      }),
    ],
  })
  const css = getInstance(styleObject).css

  return minified
    ? new CleanCSS()
        .minify(css)
        .styles
    : css
}

module.exports = {
  arrangeAsGrid,
  businessCard,
  circleSection,
  clone,
  degToRad: deg2rad,
  formatSvg,
  cssobjToCss,
  optimizePath,
  optimizePathAbsolute,
  optimizePathRelative,
  radToDeg: rad2deg,
  rgb,
  rgba,
}
