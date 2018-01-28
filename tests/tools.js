process.env.NODE_ENV = 'development'

// Utils

const assert = require('assert')
const utils = require('../source/tools/utils')

assert.equal(utils.clampTop(50, 377), 50)
assert.equal(utils.clampBottom(0, -37), 0)
assert.equal(utils.channelNormalize(300), 255)


// Tools

const tools = require('../source/tools')

// rgb
assert.equal(tools.rgb(25, 35, 16), 'rgb(25,35,16)')
assert.equal(tools.rgb(...[25, 35, 16]), 'rgb(25,35,16)')
assert.equal(tools.rgb(-25, -35, -16), 'rgb(0,0,0)')
assert.equal(tools.rgb(325, 335, 316), 'rgb(255,255,255)')

assert.throws(
  () => tools.rgb('25', '35', '16'),
  /TypeError: Invalid value/,
)
assert.throws(
  () => tools.rgb(25, 35, 16, 53),
  /TypeError: Function applied to too many arguments/,
)

// rgba
assert.equal(tools.rgba(25, 35, 16, 33), 'rgba(25,35,16,33)')
