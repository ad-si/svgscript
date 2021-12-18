/* eslint-disable new-cap, no-spaced-func, indent, no-unexpected-multiline */

import $ from "sanctuary-def"  // eslint-disable-line id-length
const def = $.create({
  checkTypes: true,
  env: $.env,
})


export const clampBottomCurried = def("clampBottom")
  ({})
  ([$.ValidNumber, $.ValidNumber, $.ValidNumber])
  (bottomValue => value =>
    Math.max(value, bottomValue))

export function clampBottom (valueA, valueB) {
  return clampBottomCurried(valueA)(valueB)
}


export const clampTopCurried = def("clampTop")
  ({})
  ([$.ValidNumber, $.ValidNumber, $.ValidNumber])
  (topValue => value =>
    Math.min(value, topValue))


export function clampTop (valueA, valueB) {
  return clampTopCurried(valueA)(valueB)
}


export const channelNormalize = def("channelNormalize")
  ({})
  ([$.ValidNumber, $.ValidNumber])
  (value =>
    Math.min(255, Math.max(0, value)))
