module.exports = (red, green, blue, alpha) => {
  if (Array.isArray(red)) {
    [red, green, blue, alpha] = red
  }

  return alpha
    ? `rgba(${[red, green, blue, alpha]})`
    : `rgb(${[red, green, blue]})`
}
