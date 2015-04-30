require('coffee-script/register')

var fs = require('fs'),
	path = require('path'),
	shaven = require('shaven'),
	semver = require('semver'),
	traverse = require('traverse')


function addCoordinateSystem (icon) {

	var showOrigin = false

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

	return icon
}

function createIcon (name, module) {

	var content

	if (!module)
		throw new Error('Module ' + name + ' was not passed to createIcon().')

	if (!module.targetVersion || semver.lt(module.targetVersion, '0.4.0')) {

		if (module.shaven) {

			content = module.shaven()

			if (!Array.isArray(content))
				throw new TypeError(name + '.shaven() must return an array!')


			// Create transformation string from transformation objects
			content = traverse(content).forEach(function (value) {

				if (typeof value === 'number')
					this.update(parseFloat(value.toFixed(15)))

				if (this.key === 'transform' && Array.isArray(value))
					this.update(
						value
							.map(function (transformation) {

								var string = transformation.type + '(',
									values = []

								if (transformation.type === 'rotate')
									values.push(transformation.degrees || 0)

								if (transformation.x)
									values.push(transformation.x)

								if (transformation.y)
									values.push(transformation.y)

								string += values.join()
								string += ')'

								return string
							})
							.join(' ')
					)
			})


			addCoordinateSystem(content)

			content = shaven(content)[0]
		}
		else if (module.svg) {

			content = module.svg()

			if (typeof content !== 'string')
				throw new TypeError(name + '.svg() must return a string!')
		}
		else
			console.error('Icon module does not provide a suitable interface!')
	}


	return content
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

function getIcons (iconsDirectoryPath) {

	var fileNames,
		icons = []


	fileNames = fs.readdirSync(iconsDirectoryPath)

	fileNames
		.filter(function (fileName) {
			return fileName.search(/.*\.(svg|js|coffee)/) > -1
		})
		.forEach(function (iconPath) {

			var name,
				module

			iconPath = path.join(iconsDirectoryPath, iconPath)
			name = path.basename(
				iconPath,
				path.extname(iconPath)
			)

			delete require.cache[require.resolve(iconPath)]

			module = require(iconPath)

			icons.push({
				basename: name,
				content: createIcon(name, module)
			})
		})

	return icons
}


module.exports = {
	getIcons: getIcons,
	createIcon: createIcon
}
