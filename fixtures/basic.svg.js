/* eslint-disable id-length */

export default function (config, tools) {
  const width = 214
  const height = 214
  const screwDiameter = 3
  const renderScrews = false

  return tools.shaven(["svg",
    {
      width: width + "mm",
      height: height + "mm",
      viewBox: [0, 0, width, height],
    },
    ["path", {
      d: "M7,0" +
        "h200" +
        "a 7 7 0 0 0 7 7" +
        "v200" +
        "a 7 7 0 0 0 -7 7" +
        "h-56" +
        "a 2 2 0 0 1 -2 -2" +
        "v-8" +
        "h-84" +
        "v8" +
        "a 2 2 0 0 1 -2 2" +
        "h-56" +
        "a 7 7 0 0 0 -7 -7" +
        "v-200" +
        "a 7 7 0 0 0 7 -7" +
        "z",
      style: {
        strokeWidth: "0.001mm",
        stroke: "red",
      },
    }],

    // Screw heads
    ["g", renderScrews, {fill: "green"},
      ["circle", {
        r: 2.6,
        cx: 2.5,
        cy: 2.5,
      }],
      ["circle", {
        r: 2.6,
        cx: 211.5,
        cy: 2.5,
      }],
      ["circle", {
        r: 2.6,
        cx: 211.5,
        cy: 211.5,
      }],
      ["circle", {
        r: 2.6,
        cx: 2.5,
        cy: 211.5,
      }],
    ],

    // Holes
    ["g", renderScrews, {r: screwDiameter / 2},
      ["circle", {
        r: screwDiameter / 2,
        cx: 2.5,
        cy: 2.5,
      }],
      ["circle", {
        r: screwDiameter / 2,
        cx: 211.5,
        cy: 2.5,
      }],
      ["circle", {
        r: screwDiameter / 2,
        cx: 211.5,
        cy: 211.5,
      }],
      ["circle", {
        r: screwDiameter / 2,
        cx: 2.5,
        cy: 211.5,
      }],
    ],
  ]).rootElement
}
