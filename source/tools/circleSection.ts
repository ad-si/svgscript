import polarToCartesian from "./polarToCartesian.js"

export interface CircleSectionOptions {
  x?: number
  y?: number
  radius?: number
  startAngle?: number
  endAngle?: number
}

export default (options: CircleSectionOptions): string => {
  const x = options.x || 0
  const y = options.y || 0
  const radius = options.radius || 1
  const startAngle = options.startAngle || 0
  const endAngle = options.endAngle || 90

  const start = polarToCartesian(x, y, radius, startAngle)
  const end = polarToCartesian(x, y, radius, endAngle)
  const diff = (endAngle - startAngle + 360) % 360
  const largeArc = diff > 180 ? 1 : 0
  const pathString = `M${start.x},${start.y}` +
    `A${radius},${radius} 0 ${largeArc} 1 ${end.x},${end.y}` +
    `L${x},${y}` +
    "z"

  return pathString
}
