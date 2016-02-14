module.exports = (x, y, radius, startAngle, endAngle) => {

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
