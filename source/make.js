import path from 'path'

import fse from 'fs-extra'
import rimraf from 'rimraf'
import yaml from 'js-yaml'
import chalk from 'chalk'
import Svgo from 'svgo'
const svgo = new Svgo()

import tools from './tools/index.js'
import createIcon from './createIcon.js'


export default async (makeFilePath) => {
  const iconsDirectory = path.dirname(makeFilePath)
  let fileContent
  let deployment

  // Remove build folder
  rimraf.sync(path.join(path.dirname(makeFilePath), 'build'))

  try {
    fileContent = fse.readFileSync(makeFilePath)
    deployment = yaml.load(fileContent)
  }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  console.info('Write Icons:')

  deployment.icons.forEach(async icon => {
    const absoluteIconPath = path.resolve(iconsDirectory, icon.filePath)
    const iconModule = await import(absoluteIconPath)

    if (icon.skip) return

    icon.targets.forEach((targetData, index) => {
      let scale = ''
      let absoluteTargetPath = absoluteIconPath.replace(
        /(\.svg)?\.js$/i,
        (index === 0 ? '' : index) + '.svg',
      )

      if (Object.prototype.hasOwnProperty.call(targetData, 'fileName')) {
        absoluteTargetPath = path.join(
          absoluteTargetPath
            .slice(0, -path.basename(absoluteTargetPath).length),
          targetData.fileName,
        )
      }

      if (Object.prototype.hasOwnProperty.call(targetData, 'filePath')) {
        absoluteTargetPath = path.resolve(iconsDirectory, targetData.filePath)
      }

      if (targetData.scale > 0) {
        scale = '@' + targetData.scale + 'x'
        absoluteTargetPath = absoluteTargetPath.replace(
          /\.svg$/i,
          scale + '.svg',
        )
      }

      let svgPromise = Promise.resolve(
        tools.formatSvg(createIcon(
          icon.fileName,
          iconModule,
          targetData,
        )),
      )

      if (targetData.minify) {
        svgPromise = svgPromise
          .then(svg => svgo.optimize(svg))
          .then(result => result.data)
      }

      svgPromise
        .then(svg => fse.writeFile(absoluteTargetPath, svg))
        .then(() =>
          console.info(` - ${absoluteTargetPath} ${chalk.green('✔')}`),
        )
        .catch(console.error)
    })
  })
}
