export default function (conf = {}, tools) {

  // Units in mm

  const currentView = 'side'

  const defaults = {
    width: 50,
    height: 60,
    backgroundColor: 'hsl(0,0%,90%)',
    color: 'burlywood',
    strokeColor: 'rgb(0, 0, 0)',
    strokeWidth: 0.1,
    cardboardThickness: 4,

    crossbarsTransform: 'translate(10,10)',
    showCrossBars1: true,

    showCrossBars2: false,
    crossbars2Transform: 'translate(0,90)',

    sideWallsTransform: 'translate(10,10)',

    showSideWall1: true,
    sideWall1Transform: 'translate(20,10)',

    showSideWall2: false,

    showBoundingBox: true,

    // Scale factor to display it in real life size
    // Retina display: 1.3, standard display: 1.065
    scale: 1,
  }

  const views = {
    side: {
      width: 70,
      height: 70,
      showCrossBars1: false,
      showCrossBars2: false,
    },
  }

  // const angle = tools.radToDeg(Math.atan(80 / 90))
  // const cornerRadius = 4

  // const stand = {
  //   height: 180,
  //   slotOffset: 30,
  //   slotDepth: 20,
  //   slotDistance: Math.sqrt((90 * 90) + (80 * 80)),
  //   hookOffset: 60,
  //   crossBarHeight: 40,
  //   crossBarLength: 260,
  //   crossBarPadding: 5,
  //   crossBarSlotOffset: 10, // Center of slot
  // }


  conf = Object.assign(defaults, views[currentView], conf)


  const svgDom = ['svg',
    {
      width: (conf.width * conf.scale) + 'mm',
      height: (conf.height * conf.scale) + 'mm',
      viewBox: [
        0,
        0,
        conf.width,
        conf.height,
      ].join(),
    },
    ['rect',
      {
        style: {
          fill: conf.color,
        },
        x: 55 - conf.cardboardThickness / 2,  // eslint-disable-line id-length
        y: 40,  // eslint-disable-line id-length
        width: 50,
        height: 20,
      },
    ],
  ]

  return tools.shaven(svgDom).rootElement
}
