module.exports = (red, green, blue, alpha) => {
  alpha = alpha || 1

  if (Array.isArray(red)) {
    const values = red
    if (values.length === 3) {
      return 'rgb(' + values.join() + ')'
    }
    else if (values.length === 4) {
      return 'rgba(' + values.join() + ')'
    }
    else {
      throw new RangeError(
        values.length + ' is an invalid number of Array elements!'
      )
    }
  }

  else if (alpha === undefined || alpha === 0) {
    return 'rgb(' + [red, green, blue].join() + ')'
  }
  else {
    return 'rgba(' + [red, green, blue, alpha].join() + ')'
  }
}
