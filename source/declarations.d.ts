declare module "shaven" {
  type ShavenElement = unknown
  interface ShavenResult {
    rootElement: string
    ids: Record<string, unknown>
    [key: string]: unknown
  }
  function shaven(input: ShavenElement, ...rest: unknown[]): ShavenResult
  export default shaven
}

declare module "deg2rad" {
  function deg2rad(degrees: number): number
  export default deg2rad
}

declare module "rad2deg" {
  function rad2deg(radians: number): number
  export default rad2deg
}

declare module "cssobj-core" {
  type CssObjInstance = (styleObject: unknown) => { css: string }
  function cssobjCore(options?: unknown): CssObjInstance
  export default cssobjCore
}

declare module "cssobj-plugin-gencss" {
  function plugin(options?: unknown): unknown
  export default plugin
}

declare module "sanctuary" {
  const S: any
  export default S
}

declare module "sanctuary-def" {
  const $: any
  export default $
}

declare module "svgpath" {
  class SvgPath {
    constructor(path: string)
    abs(): SvgPath
    rel(): SvgPath
    round(precision: number): SvgPath
    toString(): string
  }
  export default SvgPath
}

declare module "browserify-middleware" {
  import { RequestHandler } from "express"
  function browserify(path: string, options?: unknown): RequestHandler
  export default browserify
}

declare module "rimraf" {
  function rimraf(path: string, callback?: (err: Error | null) => void): void
  namespace rimraf {
    function sync(path: string): void
  }
  export default rimraf
}

declare module "svgo" {
  interface OptimizeResult {
    data: string
    [key: string]: unknown
  }
  export function optimize(svg: string, options?: unknown): OptimizeResult
}
