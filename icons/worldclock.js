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

		['g#clockFace', {
			transform: 'translate(30,30)',
			style: 'stroke-width: 4;' +
			       'stroke: black;' +
			       'stroke-linecap: round;'},
			['circle', {
				r: 23,
				style: 'fill: transparent;'
			}],
			['ellipse', {
				rx: 11,
				ry: 23,
				style: 'fill: transparent;' +
				       'stroke-width: 2;'
			}],
			['line', {
				y1: -23,
				y2: 23,
				style: 'stroke-width: 2;'
			}],
			['g', {style: 'stroke-width: 2;'},
				['line', {
					x1: -18,
					y1: -11,
					x2: 18,
					y2: -11
				}],
				['line', {
					x1: -18,
					y1: 11,
					x2: 18,
					y2: 11
				}],
				['line', {
					x1: -23,
					x2: 23
				}]
			]
		]
	]
}
