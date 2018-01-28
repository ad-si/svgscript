/* eslint-disable new-cap */

const $ = require('sanctuary-def') // eslint-disable-line id-length
const def = $.create({
  checkTypes: process.env.NODE_ENV === 'development',
  env: $.env,
})


const clampBottom = def(
  'clampBottom',
  {},
  [$.ValidNumber, $.ValidNumber, $.ValidNumber],
  (bottomValue, value) =>
    Math.max(value, bottomValue)
)


const clampTop = def(
  'clampTop',
  {},
  [$.ValidNumber, $.ValidNumber, $.ValidNumber],
  (topValue, value) =>
    Math.min(value, topValue)
)


const channelNormalize = def(
  'channelNormalize',
  {},
  [$.ValidNumber, $.ValidNumber],
  value =>
    clampTop(255, clampBottom(0, value))
)


module.exports = {
  clampTop,
  clampBottom,
  channelNormalize,
}
