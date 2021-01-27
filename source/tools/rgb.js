/* eslint-disable no-spaced-func, indent, no-unexpected-multiline */

import S from 'sanctuary'  // eslint-disable-line id-length
import $ from 'sanctuary-def'  // eslint-disable-line id-length
import {channelNormalize} from './utils.js'

const def = $.create({
  checkTypes: true,
  env: $.env,
})


const rgbCurried = def('rgb')
  ({})
  ([$.ValidNumber, $.ValidNumber, $.ValidNumber, $.String])
  (red => green => blue => {
    const redNew = channelNormalize(red)
    const greenNew = channelNormalize(green)
    const blueNew = channelNormalize(blue)

    const value = S.joinWith('')([
      'rgb(',
      S.joinWith(',')(S.map(S.show)([redNew, greenNew, blueNew])),
      ')',
    ])

    return value
  })


export default function (red, green, blue) {
  if (arguments.length !== 3) {
    throw new Error(`Expected 3 arguments, not ${arguments.length}`)
  }
  return rgbCurried(red)(green)(blue)
}
