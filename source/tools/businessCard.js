/* eslint-disable id-length */

import rgb from './rgb.js'
import arrangeAsGrid from './arrangeAsGrid.js'


export default (options = {}) => {
  const {
    a4Width = 210,
    a4Height = 297,
    cardWidth = 85,
    cardHeight = 55,
    unit = 'mm',
    fontSize = 4,
    side = 'front', // front or back
    printLayout = false,
    cutView = false,
    showBackground = false,
    name = 'John Doe',
    job = 'CEO',
    email = 'john@doe.com',
    cardGraphic = ['g#card',
      {
        style: {
          'text-anchor': 'middle',
          'font-size': `${fontSize}px`,
        },
      },
      ['rect.background', {
        width: cardWidth,
        height: cardHeight,
        style: {
          fill: rgb(255, 255, 255),
        },
      }],

      ['text.name', name, {
        x: cardWidth / 2,
        y: (cardHeight / 2) - (fontSize * 2.2),
        style: {
          'font-size': `${fontSize * 1.5}px`,
          'font-weight': 900,
        },
      }],
      ['text.job', job,
        {
          x: cardWidth / 2,
          y: (cardHeight / 2) - (fontSize * 0.4),
          style: {
            fill: 'rgb(100, 100, 100)',
            'font-size': `${fontSize * 1.2}px`,
          },
        },
        side === 'back',
      ],
      ['text.email', email,
        {
          x: cardWidth / 2,
          y: cardHeight / 2 + (fontSize * 2.2),
          style: {
            fill: 'rgb(100, 100, 100)',
          },
        },
        side === 'back',
      ],
    ],
  } = options

  let svgDom = []
  const svgStyle = ['style',
    `text {
      fill: rgb(60, 60, 60);
      font-family: Helvetica, sans-serif;
    }`,
  ]

  if (printLayout) {
    const cardGrid = arrangeAsGrid({
      id: 'printSheet',
      rows: 5,
      columns: 2,
      cx: a4Width / 2,
      cy: a4Height / 2,
      cellWidth: cardWidth,
      cellHeight: cardHeight,
      backgroundColor: rgb(200, 200, 200),
      graphic: ['use.card', {'xlink:href': '#card'}],
      cutView,
      cornerLength: 2,
    })

    svgDom = ['svg',
      {
        width: a4Width + unit,
        height: a4Height + unit,
        viewBox: [0, 0, a4Width, a4Height],
      },
      svgStyle,
      ['defs',
        cardGraphic,
        cardGrid,
        showBackground
          ? ['rect#background',
            {
              width: a4Width,
              height: a4Height,
              stroke: 'gray',
              'stroke-width': 0.1,
              style: {
                fill: rgb(245, 245, 245),
              },
            },
          ]
          : undefined,
      ],
      ['use',
        {'xlink:href': '#background'},
        showBackground,
      ],
      ['use', {'xlink:href': '#printSheet'}],
    ]
  }
  else {
    svgDom = ['svg',
      {
        width: cardWidth + unit,
        height: cardHeight + unit,
        viewBox: [0, 0, cardWidth, cardHeight],
      },
      svgStyle,
      ['defs', cardGraphic],
      ['use', {'xlink:href': '#card'}],
    ]
  }

  return svgDom
}
