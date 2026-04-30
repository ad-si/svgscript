import traverse from "traverse"

interface Transformation {
  type: "rotate" | "translate" | string
  degrees?: number
  x?: number
  y?: number
}

export default (content: unknown): unknown => {
  return traverse(content)
    .forEach(function (this: any, value: unknown) {
      if (typeof value === "number") {
        this.update(parseFloat(value.toFixed(15)))
      }

      if (this.key === "transform" && Array.isArray(value)) {
        this.update(
          (value as Transformation[])
            .map(transformation => {
              const values: number[] = []

              if (transformation.type === "rotate") {
                values.push(transformation.degrees || 0)
              }
              if (transformation.type === "translate") {
                values.push(transformation.x || 0)
                values.push(transformation.y || 0)
              }

              return `${transformation.type}(${values})`
            })
            .join(" "),
        )
      }
    })
}
