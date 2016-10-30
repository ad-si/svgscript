const traverse = require('traverse')

module.exports = (content) => {
  // Create transformation string from transformation objects
  return traverse(content)
    // Don't use arrow function to have correct scope for this
    .forEach(function (value) {
      if (typeof value === 'number') {
        this.update(parseFloat(value.toFixed(15)))
      }

      if (this.key === 'transform' && Array.isArray(value)) {
        this.update(
          value
            .map(transformation => {
              let string = transformation.type + '('
              const values = []

              if (transformation.type === 'rotate') {
                values.push(transformation.degrees || 0)
              }
              if (transformation.x) {
                values.push(transformation.x)
              }
              if (transformation.y) {
                values.push(transformation.y)
              }

              string += values.join()
              string += ')'

              return string
            })
            .join(' ')
        )
      }
    })
}
