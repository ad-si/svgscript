import S from "sanctuary"
import $ from "sanctuary-def"
import {channelNormalize} from "./utils.js"

const def = $.create({
  checkTypes: true,
  env: $.env,
})


const rgbaCurried = def("rgba")
  ({})
  ([$.ValidNumber, $.ValidNumber, $.ValidNumber, $.ValidNumber, $.String])
  ((red: number) =>
    (green: number) =>
    (blue: number) =>
    (alpha: number) => {
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


export default function rgba (
  red: number,
  green: number,
  blue: number,
  alpha: number,
): string {
  return rgbaCurried(red)(green)(blue)(alpha)
}
