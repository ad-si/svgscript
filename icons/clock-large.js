module.exports = function () {

	var i,
	    ticksLarge = ['g#ticksLarge'],
	    ticksSmall = ['g#ticksSmall']


	for (i = 0; i < 60; i++) {

		if (i % 5 === 0)
			ticksLarge.push(['use', {
				'xlink:href': '#tickLarge',
				transform: 'rotate(' + i * 6 + ')'
			}])

		else
			ticksSmall.push(['use', {
				'xlink:href': '#tickSmall',
				transform: 'rotate(' + i * 6 + ')'
			}])
	}


	return ['svg', {
		width: 100,
		height: 100},

		['defs',
			['rect#tickLarge', {
				x: -1.5,
				y: 34,
				width: 3,
				height: 10,
				style: 'fill: rgb(50,50,50)'
			}],
			['rect#tickSmall', {
				x: -0.5,
				y: 39,
				width: 1,
				height: 5,
				style: 'fill: rgb(50,50,50)'
			}]
		],
		['g#clockFace', {transform: 'translate(50,50)'},
			['circle', {
				r: 50,
				style: 'fill: rgb(180,185,195);'
			}],
			['circle', {
				r: 47,
				style: 'fill: rgb(240,240,240);'
			}],
			ticksSmall,
			ticksLarge,
			['line#hourHand', {
				y1: 10,
				y2: -28,
				style: 'stroke-width: 4; stroke: rgb(50,50,50);',
				transform: 'rotate(-70)'
			}],
			['line#minuteHand', {
				y1: 10,
				y2: -42,
				style: 'stroke-width: 4; stroke: rgb(50,50,50);',
				transform: 'rotate(70)'
			}],
			['g#minuteHand', {
				transform: 'rotate(-20)',
				style: 'stroke: rgb(200,0,0); stroke-width: 2;'},
				['line', {
					y1: 10,
					y2: -36
				}],
				['circle', {
					cy: -40,
					r: 4,
					style: 'fill: transparent'
				}]
			]
		]
	]
}
