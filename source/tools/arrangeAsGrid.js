import clone from 'clone'

import generateCorners from './generateCorners.js'


function orthoLine (options = {}) {
  // eslint-disable-next-line id-length
  const {x = 0, y = 0, h = 0, v = 0} = options
  return ['line', {
    x1: x,
    y1: y,
    x2: x + h,
    y2: y + v,
  }]
}

export default (printOptions = {}) => {
  if (printOptions.cutView) {
    printOptions.gridMargin = 0
    printOptions.cellMargin = 0
  }

  const {
    backgroundColor = false,
    cellWidth = 10,
    cellHeight = 10,

    cellMarginTop = printOptions.cellMargin || 0,
    cellMarginRight = printOptions.cellMargin || 0,
    cellMarginBottom = printOptions.cellMargin || 0,
    cellMarginLeft = printOptions.cellMargin || 0,
    // TODO: marginCollapse = false,

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

    cutView = false,
    cutMarkLength = 10,
    cutMarkColor = 'rgb(127, 127, 127)',
    cutMarkWidth = 0.2,
    firstCutDirection = 'y',

    cornerView = false,
    innerCorners = true,
  } = printOptions

  const gridWidth = (cellMarginLeft + cellWidth + cellMarginRight) * columns
  const totalGridWidth = gridMarginLeft + gridWidth + gridMarginRight

  const gridHeight = (cellMarginTop + cellHeight + cellMarginBottom) * rows
  const totalGridHeight = gridMarginTop + gridHeight + gridMarginBottom

  const totalCellWidth = cellMarginLeft + cellWidth + cellMarginRight
  const totalCellHeight = cellMarginTop + cellHeight + cellMarginBottom

  const gridCells = []
  const cutMarks = []

  /* eslint-disable id-length */

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const topLeftCornerX = (totalCellWidth * column) + cellMarginLeft
      const topLeftCornerY = (totalCellHeight * row) + cellMarginTop

      const isLastRow = row === (rows - 1)
      const isLastColumn = column === (columns - 1)

      const isFirstRow = row === 0
      const isFirstColumn = column === 0

      const gridCell = ['g',
        {
          transform: [{
            type: 'translate',
            x: topLeftCornerX,
            y: topLeftCornerY,
          }],
        },
      ]

      if (cornerView) {
        gridCell.push(generateCorners({
          width: cellWidth,
          height: cellHeight,
          marginLeft: cellMarginLeft,
          marginTop: cellMarginTop,
          marginRight: cellMarginRight,
          marginBottom: cellMarginBottom,
          viewSwitches: !innerCorners
            ? [
              // Display only in first column & first row
              innerCorners || isFirstColumn || isFirstRow,
              // Display only in last column & first row
              innerCorners || isLastColumn || isFirstRow,
              innerCorners || isLastColumn || isLastRow,
              innerCorners || isFirstColumn || isLastRow,
            ]
            : undefined,
        }))
      }

      if (cutView) {
        const play = 1
        if (firstCutDirection === 'y') {
          // Horizontal marks
          // Left
          cutMarks.push(orthoLine({
            x: topLeftCornerX,
            y: topLeftCornerY,
            h: cutMarkLength / 2,
          }))
          // Right
          cutMarks.push(orthoLine({
            x: topLeftCornerX + totalCellWidth,
            y: topLeftCornerY,
            h: - cutMarkLength / 2,
          }))
          if (isLastRow) {
            // Left
            cutMarks.push(orthoLine({
              x: topLeftCornerX,
              y: topLeftCornerY + totalCellHeight,
              h: cutMarkLength / 2,
            }))
            // Right
            cutMarks.push(orthoLine({
              x: topLeftCornerX + totalCellWidth,
              y: topLeftCornerY + totalCellHeight,
              h: - cutMarkLength / 2,
            }))
          }

          // Vertical marks
          // Top
          if (isFirstRow) {
            cutMarks.push(orthoLine({
              x: topLeftCornerX,
              y: topLeftCornerY - play,
              v: -cutMarkLength / 2,
            }))
            if (isLastColumn) {
              cutMarks.push(orthoLine({
                x: topLeftCornerX + totalCellWidth,
                y: topLeftCornerY - play,
                v: - cutMarkLength / 2,
              }))
            }
          }
          // Bottom
          if (isLastRow) {
            cutMarks.push(orthoLine({
              x: topLeftCornerX,
              y: topLeftCornerY  + totalCellHeight + play,
              v: cutMarkLength / 2,
            }))
            if (isLastColumn) {
              cutMarks.push(orthoLine({
                x: topLeftCornerX + totalCellWidth,
                y: topLeftCornerY  + totalCellHeight + play,
                v: cutMarkLength / 2,
              }))
            }
          }
        }

        if (firstCutDirection === 'x') {
          // Veritcal Marks
          // Top
          cutMarks.push(orthoLine({
            x: topLeftCornerX,
            y: topLeftCornerY,
            v: cutMarkLength / 2,
          }))
          // Bottom
          cutMarks.push(orthoLine({
            x: topLeftCornerX,
            y: topLeftCornerY + totalCellHeight,
            v: - cutMarkLength / 2,
          }))
          if (isLastColumn) {
            // Top
            cutMarks.push(orthoLine({
              x: topLeftCornerX + totalCellWidth,
              y: topLeftCornerY,
              v: cutMarkLength / 2,
            }))
            // Bottom
            cutMarks.push(orthoLine({
              x: topLeftCornerX + totalCellWidth,
              y: topLeftCornerY + totalCellHeight,
              v: - cutMarkLength / 2,
            }))
          }

          // Horizontal marks
          // Left
          if (isFirstColumn) {
            cutMarks.push(orthoLine({
              x: topLeftCornerX - play,
              y: topLeftCornerY,
              h: -cutMarkLength / 2,
            }))
            if (isLastRow) {
              cutMarks.push(orthoLine({
                x: topLeftCornerX - play,
                y: topLeftCornerY + totalCellHeight,
                h: - cutMarkLength / 2,
              }))
            }
          }
          // Right
          if (isLastColumn) {
            cutMarks.push(orthoLine({
              x: topLeftCornerX + totalCellWidth + play,
              y: topLeftCornerY,
              h: cutMarkLength / 2,
            }))
            if (isLastRow) {
              cutMarks.push(orthoLine({
                x: topLeftCornerX + totalCellWidth + play,
                y: topLeftCornerY + totalCellHeight,
                h: cutMarkLength / 2,
              }))
            }
          }
        }
      }

      gridCell.push(clone(graphic))

      gridCells.push(gridCell)
    }
  }

  const grid = ['g.grid',
    {
      id,
      transform: cx || cy
        ? [{
          type: 'translate',
          x: (cx - (totalGridWidth / 2)) || 0,
          y: (cy - (totalGridHeight / 2)) || 0,
        }]
        : false,
    },
  ]

  if (
    backgroundColor &&
    !cornerView &&
    !cutView &&
    (
      totalCellWidth !== cellWidth ||
      totalCellHeight !== cellHeight
    )
  ) {
    const background = ['rect.background',
      {
        width: totalGridWidth,
        height: totalGridHeight,
        style: {fill: backgroundColor},
      },
    ]
    grid.push(background)
  }

  const cells = ['g.cells',
    {
      transform: [{
        type: 'translate',
        x: gridMarginLeft,
        y: gridMarginTop,
      }],
    },
    ...gridCells,
  ]
  grid.push(cells)

  if (cutView) {
    const cutMarksGroup = [
      'g.cutMarks',
      {
        style: {
          stroke: cutMarkColor,
          'stroke-width': cutMarkWidth,
        },
      },
      ...cutMarks,
    ]
    grid.push(cutMarksGroup)
  }

  return grid
}
