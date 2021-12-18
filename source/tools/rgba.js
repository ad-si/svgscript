/* eslint-disable new-cap, no-spaced-func, indent, no-unexpected-multiline */

import S from "sanctuary"  // eslint-disable-line id-length
import $ from "sanctuary-def"  // eslint-disable-line id-length
import {channelNormalize} from "./utils.js"

const def = $.create({
  checkTypes: true,
  env: $.env,
})


const rgbaCurried = def("rgba")
  ({})
  ([$.ValidNumber, $.ValidNumber, $.ValidNumber, $.ValidNumber, $.String])
  (red => green => blue => alpha => {
    const redNew = channelNormalize(red)
    const greenNew = channelNormalize(green)
    const blueNew = channelNormalize(blue)
    const alphaNew = channelNormalize(alpha)
    const channelArray = [redNew, greenNew, blueNew, alphaNew]

    const value = S.joinWith("")([
      "rgba(",
      S.joinWith(",")(S.map(S.show)(channelArray)),
      ")",
    ])

    return value
  })


export default function (red, green, blue, alpha) {
  return rgbaCurried(red)(green)(blue)(alpha)
}
