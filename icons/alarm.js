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
			['path#bell', {
				transform: 'translate(0,-25)',
				d: 'M -10,0 ' +
				   'a 25 25 0 0 1 20 0 ' +
				   'A 10 10 0 1 0 -10,0 ' +
				   'z',
				'stroke-width': 0
			}]
		],
		['g#clockFace', {
			transform: 'translate(30,30)',
			style: 'stroke-width: 4; stroke: black;' +
			       ' stroke-linecap: round'},
			['circle', {
				r: 23,
				style: 'fill: transparent'
			}],
			['line#hourHand', {
				y2: 16,
				transform: 'rotate(180)'
			}],
			['line#minuteHand', {
				y2: 10,
				transform: 'rotate(60)'
			}],
			['use', {
				'xlink:href': '#bell',
				transform: 'rotate(-40)'
			}],
			['use', {
				'xlink:href': '#bell',
				transform: 'rotate(40)'
			}]
		]

	]
}
