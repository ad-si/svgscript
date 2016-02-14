module.exports = (red, green, blue, alpha) => {

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
