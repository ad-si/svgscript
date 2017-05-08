const path = require('path')

const fse = require('fs-extra')
const rimraf = require('rimraf')
const yaml = require('js-yaml')
const chalk = require('chalk')
const Svgo = require('svgo')
const svgo = new Svgo()

const tools = require('./tools')
const createIcon = require('./createIcon')


module.exports = (makeFilePath) => {
  const iconsDirectory = path.dirname(makeFilePath)
  let fileContent
  let deployment

  // Remove build folder
  rimraf.sync(path.join(path.dirname(makeFilePath), 'build'))

  try {
    fileContent = fse.readFileSync(makeFilePath)
    deployment = yaml.safeLoad(fileContent)
  }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  console.info('Write Icons:')

  deployment.icons.forEach(icon => {
    const absoluteIconPath = path.resolve(iconsDirectory, icon.filePath)
    const iconModule = require(absoluteIconPath)

    if (icon.skip) return

    icon.targets.forEach((targetData, index) => {
      let scale = ''
      let absoluteTargetPath = absoluteIconPath.replace(
        /(\.svg)?\.js$/i,
        (index === 0 ? '' : index) + '.svg'
      )

      if (targetData.hasOwnProperty('fileName')) {
        absoluteTargetPath = path.join(
          absoluteTargetPath
            .slice(0, -path.basename(absoluteTargetPath).length),
          targetData.fileName
        )
      }

      if (targetData.hasOwnProperty('filePath')) {
        absoluteTargetPath = path.resolve(iconsDirectory, targetData.filePath)
      }

      if (targetData.scale > 0) {
        scale = '@' + targetData.scale + 'x'
        absoluteTargetPath = absoluteTargetPath.replace(
          /\.svg$/i,
          scale + '.svg'
        )
      }

      let svgPromise = Promise.resolve(
        tools.formatSvg(createIcon(
          icon.fileName,
          iconModule,
          targetData
        ))
      )

      if (targetData.minify) {
        svgPromise = svgPromise
          .then(svg => svgo.optimize(svg))
          .then(result => result.data)
      }

      svgPromise
        .then(svg => fse.writeFile(absoluteTargetPath, svg))
        .then(() =>
          console.info(` - ${absoluteTargetPath} ${chalk.green('✔')}`)
        )
        .catch(console.error)
    })
  })
}
