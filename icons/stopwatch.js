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

		['defs',
			['clipPath#buttonCutoff',
				['rect', {
					x: -5,
					y: -12,
					width: 10,
					height: 10
				}]
			],
			['circle#button', {
				r: 8,
				'clip-path': 'url(#buttonCutoff)'
			}]
		],
		['g#clockFace', {
			transform: 'translate(30,30)',
			style: 'stroke-width: 4;' +
			       'stroke: black;' +
			       'stroke-linecap: round;'},
			['circle', {
				r: 23,
				style: 'fill: transparent;'
			}],
			['line#secondsHand', {
				y2: 16,
				transform: 'rotate(200)'
			}],
			['use', {
				transform: 'translate(0,-20)',
				'xlink:href': '#button'
			}],
			['use', {
				transform: 'rotate(-45) translate(0,-20)',
				'xlink:href': '#button'
			}]
		]
	]
}
