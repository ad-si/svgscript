import clone from "clone"

import generateCorners from "./generateCorners.js"


interface OrthoLineOptions {
  x?: number
  y?: number
  h?: number
  v?: number
}

function orthoLine (options: OrthoLineOptions = {}) {
  const {x = 0, y = 0, h = 0, v = 0} = options
  return ["line", {
    x1: x,
    y1: y,
    x2: x + h,
    y2: y + v,
  }]
}

export interface ArrangeAsGridOptions {
  backgroundColor?: string | false
  cellWidth?: number
  cellHeight?: number
  cellMargin?: number
  cellMarginTop?: number
  cellMarginRight?: number
  cellMarginBottom?: number
  cellMarginLeft?: number
  gridMargin?: number
  gridMarginTop?: number
  gridMarginRight?: number
  gridMarginBottom?: number
  gridMarginLeft?: number
  columns?: number
  rows?: number
  graphic?: unknown[]
  id?: string
  cx?: number
  cy?: number
  cutView?: boolean
  cutMarkLength?: number
  cutMarkColor?: string
  cutMarkWidth?: number
  firstCutDirection?: "x" | "y"
  cornerView?: boolean
  innerCorners?: boolean
}

export default (printOptions: ArrangeAsGridOptions = {}) => {
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

    gridMarginTop = printOptions.gridMargin || 0,
    gridMarginRight = printOptions.gridMargin || 0,
    gridMarginBottom = printOptions.gridMargin || 0,
    gridMarginLeft = printOptions.gridMargin || 0,

    columns = 4,
    rows = 4,
    graphic = ["text", "Graphic is missing"],
    id = "grid",
    cx = undefined,
    cy = undefined,

    cutView = false,
    cutMarkLength = 10,
    cutMarkColor = "rgb(127, 127, 127)",
    cutMarkWidth = 0.2,
    firstCutDirection = "y",

    cornerView = false,
    innerCorners = true,
  } = printOptions

  const gridWidth = (cellMarginLeft + cellWidth + cellMarginRight) * columns
  const totalGridWidth = gridMarginLeft + gridWidth + gridMarginRight

  const gridHeight = (cellMarginTop + cellHeight + cellMarginBottom) * rows
  const totalGridHeight = gridMarginTop + gridHeight + gridMarginBottom

  const totalCellWidth = cellMarginLeft + cellWidth + cellMarginRight
  const totalCellHeight = cellMarginTop + cellHeight + cellMarginBottom

  const gridCells: unknown[] = []
  const cutMarks: unknown[] = []

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const topLeftCornerX = (totalCellWidth * column) + cellMarginLeft
      const topLeftCornerY = (totalCellHeight * row) + cellMarginTop

      const isLastRow = row === (rows - 1)
      const isLastColumn = column === (columns - 1)

      const isFirstRow = row === 0
      const isFirstColumn = column === 0

      const gridCell: unknown[] = ["g",
        {
          transform: [{
            type: "translate",
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
              innerCorners || isFirstColumn || isFirstRow,
              innerCorners || isLastColumn || isFirstRow,
              innerCorners || isLastColumn || isLastRow,
              innerCorners || isFirstColumn || isLastRow,
            ]
            : undefined,
        }))
      }

      if (cutView) {
        const play = 1
        if (firstCutDirection === "y") {
          cutMarks.push(orthoLine({
            x: topLeftCornerX,
            y: topLeftCornerY,
            h: cutMarkLength / 2,
          }))
          cutMarks.push(orthoLine({
            x: topLeftCornerX + totalCellWidth,
            y: topLeftCornerY,
            h: - cutMarkLength / 2,
          }))
          if (isLastRow) {
            cutMarks.push(orthoLine({
              x: topLeftCornerX,
              y: topLeftCornerY + totalCellHeight,
              h: cutMarkLength / 2,
            }))
            cutMarks.push(orthoLine({
              x: topLeftCornerX + totalCellWidth,
              y: topLeftCornerY + totalCellHeight,
              h: - cutMarkLength / 2,
            }))
          }

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

        if (firstCutDirection === "x") {
          cutMarks.push(orthoLine({
            x: topLeftCornerX,
            y: topLeftCornerY,
            v: cutMarkLength / 2,
          }))
          cutMarks.push(orthoLine({
            x: topLeftCornerX,
            y: topLeftCornerY + totalCellHeight,
            v: - cutMarkLength / 2,
          }))
          if (isLastColumn) {
            cutMarks.push(orthoLine({
              x: topLeftCornerX + totalCellWidth,
              y: topLeftCornerY,
              v: cutMarkLength / 2,
            }))
            cutMarks.push(orthoLine({
              x: topLeftCornerX + totalCellWidth,
              y: topLeftCornerY + totalCellHeight,
              v: - cutMarkLength / 2,
            }))
          }

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

  const grid: unknown[] = ["g.grid",
    {
      id,
      transform: cx || cy
        ? [{
          type: "translate",
          x: ((cx ?? 0) - (totalGridWidth / 2)) || 0,
          y: ((cy ?? 0) - (totalGridHeight / 2)) || 0,
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
    const background = ["rect.background",
      {
        width: totalGridWidth,
        height: totalGridHeight,
        style: {fill: backgroundColor},
      },
    ]
    grid.push(background)
  }

  const cells = ["g.cells",
    {
      transform: [{
        type: "translate",
        x: gridMarginLeft,
        y: gridMarginTop,
      }],
    },
    ...gridCells,
  ]
  grid.push(cells)

  if (cutView) {
    const cutMarksGroup = [
      "g.cutMarks",
      {
        style: {
          stroke: cutMarkColor,
          "stroke-width": cutMarkWidth,
        },
      },
      ...cutMarks,
    ]
    grid.push(cutMarksGroup)
  }

  return grid
}
