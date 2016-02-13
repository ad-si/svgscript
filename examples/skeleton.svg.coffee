module.exports.shaven = (config, tools) ->
	defaults =
		width: 100
		width: 100

	tools.applyDefaults(config, tools)

	return [
		'svg'
		width: width + 'mm'
		height: width + 'mm'
		viewBox: [
			0
			0
			width
			width
		]
		[
			'g',
			[
				'circle'
				r: 10
				cx: 50
				cy: 50
			]
		]
	]
