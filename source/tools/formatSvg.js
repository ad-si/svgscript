module.exports = (svgString) => {
  const missingNamespaces = []

  if (typeof svgString !== 'string') return

  if (svgString.indexOf('/2000/svg') === -1) {
    missingNamespaces
      .push('xmlns="http://www.w3.org/2000/svg"')
  }
  if (svgString.indexOf('/1999/xlink') === -1) {
    missingNamespaces
      .push('xmlns:xlink="http://www.w3.org/1999/xlink"')
  }
  if (missingNamespaces !== []) {
    svgString = svgString.replace(
      '<svg', '<svg ' + missingNamespaces.join(' ')
    )
  }
  return svgString
}
