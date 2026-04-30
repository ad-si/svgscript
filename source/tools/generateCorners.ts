interface GenerateCornersOptions {
  color?: string
  width?: number
  height?: number
  cornerLength?: number
  margin?: number
  marginLeft?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  viewSwitches?: [boolean, boolean, boolean, boolean]
}

export default (options: GenerateCornersOptions = {}) => {
  const {
    color = "rgb(127, 127, 127)",
    width = 20,
    height = 20,
    cornerLength = 10,

    marginLeft = options.margin ?? 1,
    marginTop = options.margin ?? 1,
    marginRight = options.margin ?? 1,
    marginBottom = options.margin ?? 1,

    viewSwitches = [true, true, true, true] as [boolean, boolean, boolean, boolean],
  } = options

  return ["g.corners",
    {
      style: {
        fill: color,
      },
    },
    ["rect.corner.top-left",
      {
        width: cornerLength,
        height: cornerLength,
        x: -marginLeft,
        y: -marginTop,
      },
      viewSwitches[0],
    ],
    ["rect.corner.top-right",
      {
        width: cornerLength,
        height: cornerLength,
        x: (width - cornerLength) + marginRight,
        y: -marginTop,
      },
      viewSwitches[1],
    ],
    ["rect.corner.bottom-right",
      {
        width: cornerLength,
        height: cornerLength,
        x: (width - cornerLength) + marginRight,
        y: (height - cornerLength) + marginBottom,
      },
      viewSwitches[2],
    ],
    ["rect.corner.bottom-left",
      {
        width: cornerLength,
        height: cornerLength,
        x: -marginLeft,
        y: (height - cornerLength) + marginBottom,
      },
      viewSwitches[3],
    ],
  ]
}
