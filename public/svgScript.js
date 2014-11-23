var fs = require('fs'),
	path = require('path'),
	shaven = require('shaven')


function createIcon (module) {

	var showOrigin = false,
		icon = module()

	if (typeof icon !== 'string') {

		// Add coordinate system
		if (showOrigin === true) {
			icon.push(
				['g', {
					style: 'fill: rgb(255,255,200);' +
					       'stroke: red;' +
					       'stroke-width: 1'
				},
					['line', {x1: 0, y1: -100, x2: 0, y2: 100}],
					['line', {x1: -100, y1: 0, x2: 100, y2: 0}]
				]
			)
		}

		icon = shaven(icon)[0]
	}

	return icon
}

function getGrid () {

	var gridFragment = [
			'g.grid',
			{
				style: {
					fill: 'rgb(255, 255, 200)',
					stroke: 'red',
					'stroke-width': 0.1
				}
			},
			['line', {
				style: {
					'stroke-width': 1
				},
				x1: 0,
				y1: -100,
				x2: 0,
				y2: 100
			}
			],
			['line', {
				style: {
					'stroke-width': 1
				},
				x1: -100,
				y1: 0,
				x2: 100,
				y2: 0
			}
			]
		],
		lines = [],
		a

	// Horizontal lines
	for (a = 0; a < 200; a++)
		lines.push(
			['line', {
				x1: -100 + a,
				y1: -100,
				x2: -100 + a,
				y2: 100
			}]
		)

	// Vertical lines
	for (a = 0; a < 200; a++)
		lines.push(
			['line', {
				x1: -100,
				y1: -100 + a,
				x2: 100,
				y2: -100 + a
			}]
		)

	return gridFragment
}

function getIcons(iconsDirectoryPath) {

	var fileNames,
		icons = []


	fileNames = fs.readdirSync(iconsDirectoryPath)

	fileNames
		.filter(function (fileName) {
			return fileName.search(/.*\.(svg|js)/) > -1
		})
		.forEach(function (iconPath) {

			iconPath = iconsDirectoryPath + '/' + iconPath


			delete require.cache[require.resolve(iconPath)]

			icons.push({
				fileName: path.basename(iconPath, '.js'),
				content: createIcon(require(iconPath))
			})
		})

	return icons
}


module.exports = {
	getIcons: getIcons,
	createIcon: createIcon
}
