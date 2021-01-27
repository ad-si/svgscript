import assert from 'assert'


// Utils

import {clampTop, clampBottom, channelNormalize} from '../source/tools/utils.js'

assert.equal(clampTop(50, 377), 50)
assert.equal(clampBottom(0, -37), 0)
assert.equal(channelNormalize(300), 255)


// Tools

import tools from '../source/tools/index.js'

// rgb
assert.equal(tools.rgb(25, 35, 16), 'rgb(25,35,16)')
assert.equal(tools.rgb(-25, -35, -16), 'rgb(0,0,0)')
assert.equal(tools.rgb(325, 335, 316), 'rgb(255,255,255)')

assert.throws(
  () => tools.rgb('25', '35', '16'),
  /TypeError: Invalid value/,
)
assert.throws(
  () => tools.rgb(25, 35, 16, 53),
  error => error.message.startsWith(
    'Expected 3 arguments, not 4',
  ),
)

// rgba
assert.equal(
  tools.rgba(25, 35, 16, 33),
  'rgba(25,35,16,33)',
)
