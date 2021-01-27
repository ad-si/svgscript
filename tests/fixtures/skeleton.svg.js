/* eslint-disable id-length */

export default function (config = {}, tools) {
  const {
    width = 100,
    height = 100,
  } = config

  return tools.shaven(
    ['svg',
      {
        width: width + 'mm',
        height: height + 'mm',
        viewBox: [
          0,
          0,
          width,
          height,
        ],
      },
      ['g',
        ['circle',
          {
            r: 10,
            cx: 50,
            cy: 50,
          },
        ],
      ],
    ],
  ).rootElement
}
