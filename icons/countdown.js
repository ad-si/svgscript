module.exports = function (data) {

	var width = 60,
	    height = 60,
	    scaledWidth = width,
	    scaledHeight = height

	if (data && data.scale) {
		scaledWidth = data.scale * width
		scaledHeight = data.scale * height
	}

	return ['svg', {
		width: scaledWidth,
		height: scaledHeight,
		viewBox: [0, 0, width, height].join()},

		['g', {
			transform: 'translate(30,30)',
			style: 'stroke-width: 4;' +
			       'stroke: black;'},
			['circle', {
				r: 23,
				style: 'fill: transparent;'
			}],
			['g', {style: 'stroke-width: 2;'},
				['line', {
					y1: -22,
					y2: -12
				}],
				['line', {
					x1: 22,
					x2: 8
				}],
				['line', {
					y1: 22,
					y2: 12
				}],
				['line', {
					x1: -22,
					x2: -4
				}]
			],
			['text', '3', {
				y: 10,
				style: 'stroke-width: 0;' +
				       'font-family: arial, sans-serif;' +
				       'font-size: 28;' +
				       'font-weight: 900;' +
				       'text-anchor: middle'
			}]
		]
	]
}
