import S from "sanctuary"
import $ from "sanctuary-def"
import {channelNormalize} from "./utils.js"

const def = $.create({
  checkTypes: true,
  env: $.env,
})


const rgbCurried = def("rgb")
  ({})
  ([$.ValidNumber, $.ValidNumber, $.ValidNumber, $.String])
  ((red: number) => (green: number) => (blue: number) => {
    const redNew = channelNormalize(red)
    const greenNew = channelNormalize(green)
    const blueNew = channelNormalize(blue)

    const value = S.joinWith("")([
      "rgb(",
      S.joinWith(",")(S.map(S.show)([redNew, greenNew, blueNew])),
      ")",
    ])

    return value
  })


export default function rgb (
  red: number,
  green: number,
  blue: number,
): string {
  if (arguments.length !== 3) {
    throw new Error(`Expected 3 arguments, not ${arguments.length}`)
  }
  return rgbCurried(red)(green)(blue)
}
