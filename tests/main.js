import assert from 'assert'
import commonTags from 'common-tags'

const oneLine = commonTags.oneLine

import createIcon from '../source/createIcon.js'
import basicIcon from './fixtures/basic.svg.js'
import businessCard from './fixtures/business-card.svg.js'

const expectedSvg = oneLine `<svg width="214mm" height="214mm"
  viewBox="0,0,214,214"><path d="M7,0h200a 7 7 0 0 0 7 7v200a 7 7 0 0 0 -7
  7h-56a 2 2 0 0 1 -2 -2v-8h-84v8a 2 2 0 0 1 -2 2h-56a 7 7 0 0 0 -7 -7v-200a
  7 7 0 0 0 7 -7z" style="strokeWidth:0.001mm;stroke:red"></path></svg>`
const actualSvg = createIcon('test', basicIcon)

assert.equal(
  actualSvg,
  expectedSvg,
)

assert(createIcon('businessCard', businessCard))
