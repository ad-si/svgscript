import $ from "sanctuary-def"

const def = $.create({
  checkTypes: true,
  env: $.env,
})


export const clampBottomCurried = def("clampBottom")
  ({})
  ([$.ValidNumber, $.ValidNumber, $.ValidNumber])
  ((bottomValue: number) => (value: number) =>
    Math.max(value, bottomValue))

export function clampBottom (valueA: number, valueB: number): number {
  return clampBottomCurried(valueA)(valueB)
}


export const clampTopCurried = def("clampTop")
  ({})
  ([$.ValidNumber, $.ValidNumber, $.ValidNumber])
  ((topValue: number) => (value: number) =>
    Math.min(value, topValue))


export function clampTop (valueA: number, valueB: number): number {
  return clampTopCurried(valueA)(valueB)
}


export const channelNormalize = def("channelNormalize")
  ({})
  ([$.ValidNumber, $.ValidNumber])
  ((value: number) =>
    Math.min(255, Math.max(0, value)))
