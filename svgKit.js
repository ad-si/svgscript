var clone = require('clone'),
	Svgpath = require('svgpath')


function radToDeg (radians) {
	return radians * 180 / Math.PI
}

function degToRad (degrees) {
	return degrees * Math.PI / 180
}

function polarToCartesian (centerX, centerY, radius, angleInDegrees) {

	var angleInRadians = degToRad(angleInDegrees)

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	}
}

function circleSection (x, y, radius, startAngle, endAngle) {

	var start = polarToCartesian(x, y, radius, startAngle),
		end = polarToCartesian(x, y, radius, endAngle),
		diff = (endAngle - startAngle + 360) % 360,
		largeArc = (diff > 180) ? 1 : 0

	return [
		'M', start.x, start.y,
		'A', radius, radius, 0, largeArc, 1, end.x, end.y,
		'L', x, y,
		'z'
	].join(' ')
}

function rgba (red, green, blue, alpha) {

	alpha = alpha || 1

	if (Array.isArray(red)) {
		if (value.length === 3)
			return 'rgb(' + value.join() + ')'

		else if (value.length === 4)
			return 'rgba(' + value.join() + ')'

		else
			throw new RangeError(
				value.length + ' is an invalid number of Array elements!'
			)
	}

	else if (alpha === undefined || alpha === 0)
		return 'rgb(' + [red, green, blue].join() + ')'

	else
		return 'rgba(' + [red, green, blue, alpha].join() + ')'
}


module.exports = function () {

	return {
		applyDefaults: function (configObject, defaultsObject) {

			var config = configObject || {}

			for (key in defaultsObject)
				if (defaultsObject.hasOwnProperty(key))
					config[key] = (config[key] === undefined) ?
					              defaultsObject[key] :
					              config[key]


			config.scale = config.scale || 1

			config.scaledWidth = config.scale * config.width
			config.scaledHeight = config.scale * config.height


			return config
		},
		rgb: rgba,
		rgba: rgba,
		clone: clone,
		degToRad: degToRad,
		radToDeg: radToDeg,
		optimizePath: function (path) {
			return new Svgpath(path)
				.round(0)
				.toString()
		},
		optimizePathAbsolute: function (path) {
			return new Svgpath(path)
				.abs()
				.round(0)
				.toString()
		},
		optimizePathRelative: function (path) {
			return new Svgpath(path)
				.abs()
				.round(0)
				.rel()
				.round(0)
				.toString()
		},
		circleSection: circleSection
	}

}()
