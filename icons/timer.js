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
			['path', {
				transform: 'rotate(20)',
				d: 'M -23 0 A 23 23 0 1 0 0 -23',
				style: 'fill: transparent;'
			}],
			['line#secondHand', {
				y2: 23,
				transform: 'rotate(125)'
			}],
			['circle',{
				r: 2,
				cy: -23
			}]
		]
	]
}
