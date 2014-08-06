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
		width: 120,
		height: 120,
		//viewBox: [0, 0, 80, 80].join()
	},

		['rect', {
			width: '100%',
			height: '100%',
			style: 'fill: white'
		}],

		['g#clockFace', {
			transform: 'translate(60,60)',
			style: 'stroke-width: 6;' +
			       'stroke: black;' +
			       'stroke-linecap: round;'},
			['circle', {
				r: 37,
				style: 'fill: transparent;'
			}],
			['line#hourHand', {
				y2: 26,
				transform: 'rotate(240)'
			}],
			['line#minuteHand', {
				y2: 16,
				transform: 'rotate(120)'
			}]
		]
	]
}
