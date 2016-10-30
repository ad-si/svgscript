'use strict'

const gridFragment = ['g#grid',
  {
    style: {
      fill: 'rgb(255, 255, 200)',
      stroke: 'red',
      'stroke-width': 0.1
    }
  },
  ['line#horizontal', {
    x1: -100,
    y1: 0,
    x2: 100,
    y2: 0
  }],
  ['line#vertical', {
    x1: 0,
    y1: -100,
    x2: 0,
    y2: 100
  }]
]

const lines = []
for (let a = 0; a < 200; a++) {
  // Horizontal line
  lines.push(
    ['use', {
      'xlink:href': '#horizontal',
      x: 0 ,
      y: -100 + a,
    }]
  )
  // Vertical line
  lines.push(
    ['use', {
      'xlink:href': '#vertical',
      x: -100 + a,
      y: 0,
    }]
  )
}

gridFragment.push(lines)

module.exports = gridFragment
