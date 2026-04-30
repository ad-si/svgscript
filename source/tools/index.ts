import clone from "clone"
import deg2rad from "deg2rad"
import rad2deg from "rad2deg"
import SvgPath from "svgpath"
import CleanCSS from "clean-css"
import cssobjCore from "cssobj-core"
import cssobjPluginGencss from "cssobj-plugin-gencss"
import shaven from "shaven"

import rgb from "./rgb.js"
import rgba from "./rgba.js"
import formatSvg from "./formatSvg.js"
import circleSection from "./circleSection.js"
import arrangeAsGrid from "./arrangeAsGrid.js"
import businessCard from "./businessCard.js"


function optimizePath (path: string): string {
  return new SvgPath(path)
    .round(0)
    .toString()
}

function optimizePathAbsolute (path: string): string {
  return new SvgPath(path)
    .abs()
    .round(0)
    .toString()
}

function optimizePathRelative (path: string): string {
  return new SvgPath(path)
    .abs()
    .round(0)
    .rel()
    .round(0)
    .toString()
}

interface CssobjToCssOptions {
  styleObject?: unknown
  minified?: boolean
  indentation?: string
  endOfLine?: string
}

function cssobjToCss (options: CssobjToCssOptions = {}): string {
  const {
    styleObject,
    minified,
  } = options
  let {
    indentation = "  ",
    endOfLine = "\n",
  } = options

  if (minified) {
    indentation = ""
    endOfLine = ""
  }

  const getInstance = cssobjCore({
    plugins: [
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

export default {
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
  shaven,
}
