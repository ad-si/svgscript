const fs = require('fs')
const path = require('path')

const createIcon = require('./createIcon')


module.exports = (absoluteIconsDirectoryPath) => {
  const icons = []
  let fileNames

  absoluteIconsDirectoryPath = absoluteIconsDirectoryPath || path.resolve(
    __dirname,
    '../test/printerBed.js'
  )

  const isFile = fs
    .statSync(absoluteIconsDirectoryPath)
    .isFile()

  if (isFile) {
    fileNames = [path.basename(absoluteIconsDirectoryPath)]
    absoluteIconsDirectoryPath = path.dirname(absoluteIconsDirectoryPath)
  }
  else {
    fileNames = fs.readdirSync(absoluteIconsDirectoryPath)
  }

  fileNames
    .filter(fileName => fileName.search(/.*\.(js|coffee)/) > -1)
    .forEach(iconPath => {

      iconPath = path.join(absoluteIconsDirectoryPath, iconPath)
      let name = path.basename(
        iconPath,
        path.extname(iconPath)
      )

      name += /.*\.svg$/.test(name) ? '' : '.svg'

      delete require.cache[require.resolve(iconPath)]

      try {
        const module = require(iconPath)

        icons.push({
          fileName: name,
          directoryName: absoluteIconsDirectoryPath,
          filePath: path.join(absoluteIconsDirectoryPath, name),
          content: createIcon(name, module),
        })
      }
      catch (error) {
        // eslint-disable-next-line no-console
        console.error(error.stack)
      }
    })

  return icons
}
