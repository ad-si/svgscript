const S = require('sanctuary') // eslint-disable-line id-length
const $ = require('sanctuary-def') // eslint-disable-line id-length
const {channelNormalize} = require('./utils')

const def = $.create({
  checkTypes: process.env.NODE_ENV === 'development',
  env: $.env,
})


module.exports = def(
  'rgb',
  {},
  [$.ValidNumber, $.ValidNumber, $.ValidNumber, $.String],
  (red, green, blue) => {
    const redNew = channelNormalize(red)
    const greenNew = channelNormalize(green)
    const blueNew = channelNormalize(blue)

    const value = S.joinWith('', [
      'rgb(',
      S.joinWith(',', S.map(S.toString, [redNew, greenNew, blueNew])),
      ')',
    ])

    return value
  }
)
