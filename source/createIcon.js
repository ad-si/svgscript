const shaven = require('shaven').default
const semver = require('semver')

const tools = require('./tools')
const coordinateSystemAxes = require('./tools/coordinateSystemAxes')
const createTransformationString = require('./createTransformationString')

module.exports = (name, iconModule, targetData) => {
  let content

  if (!iconModule) {
    throw new Error('Module ' + name + ' was not passed to createIcon().')
  }

  if (
    !iconModule.targetVersion ||
    semver.lt(iconModule.targetVersion, '0.4.0')
  ) {
    if (iconModule.shaven) {
      if (typeof iconModule.shaven !== 'function') {
        throw new Error('shaven property must be a function')
      }
      content = iconModule.shaven(targetData, tools)

      if (!Array.isArray(content)) {
        throw new TypeError(name + '.shaven() must return an array!')
      }

      content = createTransformationString(content)
      content.push(coordinateSystemAxes)
      content = shaven(content)[0]
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
      // eslint-disable-next-line no-console
      console.error(
        'Module ' + name + ' does not provide a suitable interface!'
      )
      return
    }
  }

  return content
}
