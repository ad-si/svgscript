'use strict'

module.exports = () => {

  return ['g',
      {
        style: {
          fill: 'rgb(255,255,200)',
          stroke: 'red',
          'stroke-width': 1,
        }
      },
      ['line', {x1: 0, y1: -100, x2: 0, y2: 100}],
      ['line', {x1: -100, y1: 0, x2: 100, y2: 0}]
    ]
}
