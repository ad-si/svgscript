'use strict'

const shaven = require('shaven')
const grid = require('../../source/tools/grid')
let gridVisibility = false


module.exports = () => {
  const svgs = window.document.querySelectorAll('svg')

  if (gridVisibility) {
    Array
      .from(window.document.querySelectorAll('svg use.grid'))
      .forEach(container => container.remove())

    gridVisibility = false
  }
  else {
    const defsSvg = window.document.getElementById('definitions')

    if (!defsSvg) {
      window.document.body.insertAdjacentHTML(
        'beforeend',
        shaven(
          ['svg#definitions',
            ['defs',
              grid
            ]
          ],
          'http://www.w3.org/2000/svg'
        )[0]
      )
    }

    for (let i = 0; i < svgs.length; i++) {
      svgs[i].insertAdjacentHTML(
        'beforeend',
        shaven(
          ['use.grid', {
            'xlink:href': '#grid'
          }],
          'http://www.w3.org/2000/svg'
        )[0]
      )
    }

    gridVisibility = true
  }
}
