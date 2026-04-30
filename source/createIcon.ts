import shaven from "shaven"
import semver from "semver"

import tools from "./tools/index.js"
import coordinateSystemAxes from "./tools/coordinateSystemAxes.js"
import createTransformationString from "./createTransformationString.js"


export interface IconModule {
  targetVersion?: string
  default?: (targetData?: unknown, tools?: unknown) => string
  shaven?: (targetData?: unknown, tools?: unknown) => unknown[]
  svg?: (targetData?: unknown, tools?: unknown) => string
}

export default (
  name: string,
  iconModule: IconModule | ((targetData?: unknown, tools?: unknown) => string),
  targetData?: unknown,
): string | undefined => {
  let content: any

  if (!iconModule) {
    throw new Error("Module " + name + " was not passed to createIcon().")
  }

  const moduleAsObject = iconModule as IconModule

  const isSupportedVersion = !moduleAsObject.targetVersion ||
    semver.lt(moduleAsObject.targetVersion, "0.4.0")

  if (!isSupportedVersion) {
    throw new Error(
      "Target version is not supported anymore." +
      "Try a newer target verison but be aware of potential errors.",
    )
  }

  if (typeof moduleAsObject.default === "function") {
    content = moduleAsObject.default(targetData, tools)
    const contentType = typeof content

    if (contentType !== "string") {
      throw new TypeError(
        `Function "(${name}).default" must return a string ` +
        `and not a ${contentType}`,
      )
    }
  }
  else if (moduleAsObject.shaven) {
    if (typeof moduleAsObject.shaven !== "function") {
      throw new Error("shaven property must be a function")
    }
    content = moduleAsObject.shaven(targetData, tools)

    if (!Array.isArray(content)) {
      throw new TypeError(name + ".shaven() must return an array!")
    }

    content = createTransformationString(content) as unknown[]
    content.push(coordinateSystemAxes)
    content = shaven(content).rootElement
  }
  else if (moduleAsObject.svg) {
    content = moduleAsObject.svg(targetData, tools)

    if (typeof content !== "string") {
      throw new TypeError(name + ".svg() must return a string!")
    }
  }
  else if (typeof iconModule === "function") {
    content = iconModule(targetData, tools)

    if (typeof content !== "string") {
      throw new TypeError(iconModule + " must return a string!")
    }
  }
  else {
    console.error(`Module ${name} does not provide a suitable interface!`)
    return
  }

  return content
}
