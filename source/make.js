const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const yaml = require('js-yaml')
const chalk = require('chalk')

const tools = require('./tools')
const createIcon = require('./createIcon')


module.expots = (makeFilePath) => {
  const iconsDirectory = path.dirname(makeFilePath)
  let fileContent
  let deployment

  // Remove build folder
  rimraf.sync(path.join(path.dirname(makeFilePath), 'build'))

  try {
    fileContent = fs.readFileSync(makeFilePath)
    deployment = yaml.safeLoad(fileContent)
  }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  // eslint-disable-next-line no-console
  console.info('Write Icons:')

  deployment.icons.forEach(icon => {
    const iconModule = require(iconsDirectory + '/' + icon.fileName)

    if (icon.skip) return

    icon.targets.forEach((targetData, index) => {
      let fileName = icon.fileName
      let scale = ''

      if (targetData.fileName) {
        fileName = targetData.fileName + '.js'
      }
      else {
        fileName = fileName.replace(
          /\.js$/i,
          (index === 0 ? '' : index) + '.js'
        )
      }

      if (targetData.scale > 0) {
        scale = '@' + targetData.scale + 'x'
        fileName = fileName.replace(/\.js$/i, scale + '.js')
      }


      fileName = fileName.replace(/\.js$/i, '.svg')

      try {
        fs.mkdirSync(path.join(iconsDirectory, 'build'))
        fs.mkdirSync(path.join(iconsDirectory, 'build/svg'))
      }
      catch (error) {
        if (error.code !== 'EEXIST') throw error
      }

      process.stdout.write(' - ' + fileName)

      fs.writeFileSync(
        path.join(iconsDirectory, 'build/svg', fileName),
        tools.formatSvg(createIcon(
          icon.fileName,
          iconModule,
          targetData
        ))
      )

      // eslint-disable-next-line no-console
      console.info(chalk.green(' ✔'))
    })
  })
}
