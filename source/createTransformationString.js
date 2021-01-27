import traverse from 'traverse'

export default (content) => {
  return traverse(content)
    // Don't use arrow function to have correct scope for this
    .forEach(function (value) {
      if (typeof value === 'number') {
        this.update(parseFloat(value.toFixed(15)))
      }

      // Create transformation string from transformation objects
      if (this.key === 'transform' && Array.isArray(value)) {
        this.update(
          value
            .map(transformation => {
              const values = []

              if (transformation.type === 'rotate') {
                values.push(transformation.degrees || 0)
              }
              if (transformation.type === 'translate') {
                values.push(transformation.x || 0)
                values.push(transformation.y || 0)
              }

              return `${transformation.type}(${values})`
            })
            .join(' '),
        )
      }
    })
}
