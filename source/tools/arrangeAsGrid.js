const clone = require('clone')

module.exports = (printOptions = {}) => {
  const {
    backgroundColor = false,
    cellWidth = 10,
    cellHeight = 10,
    cellMarginTop = 0,
    cellMarginRight = 0,
    cellMarginBottom = 0,
    cellMarginLeft = 0,
    gridMarginTop = printOptions.gridMargin || 0,
    gridMarginRight = printOptions.gridMargin || 0,
    gridMarginBottom = printOptions.gridMargin || 0,
    gridMarginLeft = printOptions.gridMargin || 0,
    columns = 4,
    rows = 4,
    graphic = ['text', 'Graphic is missing'],
    id = 'grid',
    cx = undefined,
    cy = undefined,
  } = printOptions

  const gridWidth = gridMarginLeft +
    ((cellMarginLeft + cellWidth + cellMarginRight) * columns) +
    gridMarginRight
  const gridHeight = gridMarginTop +
    ((cellMarginTop + cellHeight + cellMarginBottom) * rows) +
    gridMarginBottom
  const elements = []

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      elements.push(
        ['g',
          {
            transform: [{
              type: 'translate',
              'x': (cellMarginLeft + cellWidth + cellMarginRight) * column +
                cellMarginLeft,
              'y': (cellMarginTop + cellHeight + cellMarginBottom) * row +
                cellMarginTop,
            }],
          },
          clone(graphic),
        ]
      )
    }
  }

  return ['g.grid',
    {
      id,
      transform: cx || cy
        ? [{
          type: 'translate',
          'x': cx - (gridWidth / 2) || 0,
          'y': cy - (gridHeight / 2) || 0,
        }]
        : false,
      style: {
        'background-color': backgroundColor,
      },
    },
    backgroundColor
      ? ['rect', {
        width: gridWidth,
        height: gridHeight,
        style: {fill: backgroundColor},
      }]
      : null,
    ['g.cells',
      {
        transform: [{
          type: 'translate',
          'x': gridMarginLeft,
          'y': gridMarginTop,
        }]
      },
      ...elements,
    ],
  ]
}
