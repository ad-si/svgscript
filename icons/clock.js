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
			['line#hourHand', {
				y2: 16,
				transform: 'rotate(240)'
			}],
			['line#minuteHand', {
				y2: 10,
				transform: 'rotate(120)'
			}]
		]
	]
}
