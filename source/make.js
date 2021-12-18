import path from "path"

import fs from "fs/promises"
import rimraf from "rimraf"
import yaml from "js-yaml"
import chalk from "chalk"
import svgo from "svgo"

import tools from "./tools/index.js"
import createIcon from "./createIcon.js"


export default async (makeFilePaths) => {

  if (makeFilePaths.length !== 1) {
    throw new Error("SvgScript currently only accepts 1 file or dir path")
  }

  const makeFilePath = makeFilePaths[0]

  const iconsDirectory = path.dirname(makeFilePath)
  let fileContent
  let deployment

  // Remove build folder
  rimraf.sync(path.join(path.dirname(makeFilePath), "build"))

  try {
    fileContent = await fs.readFile(makeFilePath)
    deployment = yaml.load(fileContent)
  }
  catch (error) {
    if (error.code === "EISDIR") {
      console.error("File must be a valid YAML file")
      process.exit(1)
    }
    if (error.code !== "ENOENT") throw error
  }

  console.info("Write Icons:")

  const writePromises = deployment.icons.map(async icon => {
    if (icon.skip) return

    const absoluteIconPath = path.resolve(iconsDirectory, icon.filePath)
    const iconModule = await import(
      absoluteIconPath + `?version=${Math.random()}`
    )

    const targetWritePromises = icon.targets.map((targetData, index) => {
      let scale = ""
      let absoluteTargetPath = absoluteIconPath.replace(
        /(\.svg)?\.js$/i,
        (index === 0 ? "" : index) + ".svg",
      )

      if (Object.prototype.hasOwnProperty.call(targetData, "fileName")) {
        absoluteTargetPath = path.join(
          absoluteTargetPath
            .slice(0, -path.basename(absoluteTargetPath).length),
          targetData.fileName,
        )
      }

      if (Object.prototype.hasOwnProperty.call(targetData, "filePath")) {
        absoluteTargetPath = path.resolve(iconsDirectory, targetData.filePath)
      }

      if (targetData.scale > 0) {
        scale = "@" + targetData.scale + "x"
        absoluteTargetPath = absoluteTargetPath.replace(
          /\.svg$/i,
          scale + ".svg",
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

      return svgPromise
        .then(svg => fs.writeFile(absoluteTargetPath, svg))
        .then(() =>
          console.info(` - ${absoluteTargetPath} ${chalk.green("✔")}`),
        )
        .catch(console.error)
    })

    return Promise.all(targetWritePromises)
  })

  return Promise.all(writePromises)
}
