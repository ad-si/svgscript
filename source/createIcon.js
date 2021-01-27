import shaven from 'shaven'
import semver from 'semver'

import tools from './tools/index.js'
import coordinateSystemAxes from './tools/coordinateSystemAxes.js'
import createTransformationString from './createTransformationString.js'


export default (name, iconModule, targetData) => {
  let content

  if (!iconModule) {
    throw new Error('Module ' + name + ' was not passed to createIcon().')
  }

  const isSupportedVersion = !iconModule.targetVersion ||
    semver.lt(iconModule.targetVersion, '0.4.0')

  if (!isSupportedVersion) {
    throw new Error(
      'Target version is not supported anymore.' +
      'Try a newer target verison but be aware of potential errors.',
    )
  }

  if (typeof iconModule.default === 'function') {
    content = iconModule.default(targetData, tools)
    const contentType = typeof content

    if (contentType !== 'string') {
      throw new TypeError(
        `Function "(${name}).default" must return a string ` +
        `and not a ${contentType}`,
      )
    }

  }
  else if (iconModule.shaven) {
    if (typeof iconModule.shaven !== 'function') {
      throw new Error('shaven property must be a function')
    }
    content = iconModule.shaven(targetData, tools)

    if (!Array.isArray(content)) {
      throw new TypeError(name + '.shaven() must return an array!')
    }

    content = createTransformationString(content)
    content.push(coordinateSystemAxes)
    content = shaven(content).rootElement
  }
  else if (iconModule.svg) {
    content = iconModule.svg(targetData, tools)

    if (typeof content !== 'string') {
      throw new TypeError(name + '.svg() must return a string!')
    }
  }
  else if (typeof iconModule === 'function') {
    content = iconModule(targetData, tools)

    if (typeof content !== 'string') {
      throw new TypeError(iconModule + ' must return a string!')
    }
  }
  else {
    console.error(`Module ${name} does not provide a suitable interface!`)
    return
  }

  return content
}
