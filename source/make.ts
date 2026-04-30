import path from "path"

import fs from "fs/promises"
import rimraf from "rimraf"
import yaml from "js-yaml"
import chalk from "chalk"
import * as svgo from "svgo"

import tools from "./tools/index.js"
import createIcon, {IconModule} from "./createIcon.js"


interface TargetData {
  fileName?: string
  filePath?: string
  scale?: number
  minify?: boolean
  [key: string]: unknown
}

interface IconEntry {
  filePath: string
  fileName?: string
  skip?: boolean
  targets: TargetData[]
}

interface MakeFile {
  icons: IconEntry[]
}

export default async (makeFilePaths: string[]) => {

  if (makeFilePaths.length !== 1) {
    throw new Error("SvgScript currently only accepts 1 file or dir path")
  }

  const makeFilePath = makeFilePaths[0]

  const iconsDirectory = path.dirname(makeFilePath)
  let fileContent: Buffer | undefined
  let deployment: MakeFile | undefined

  rimraf.sync(path.join(path.dirname(makeFilePath), "build"))

  try {
    fileContent = await fs.readFile(makeFilePath)
    deployment = yaml.load(fileContent.toString()) as MakeFile
  }
  catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === "EISDIR") {
      console.error("File must be a valid YAML file")
      process.exit(1)
    }
    if (err.code !== "ENOENT") throw error
  }

  if (!deployment) return

  console.info("Write Icons:")

  const writePromises = deployment.icons.map(async icon => {
    if (icon.skip) return

    const absoluteIconPath = path.resolve(iconsDirectory, icon.filePath)
    const iconModule = await import(
      absoluteIconPath + `?version=${Math.random()}`
    ) as IconModule

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
          targetData.fileName!,
        )
      }

      if (Object.prototype.hasOwnProperty.call(targetData, "filePath")) {
        absoluteTargetPath = path.resolve(
          iconsDirectory,
          targetData.filePath!,
        )
      }

      if (targetData.scale && targetData.scale > 0) {
        scale = "@" + targetData.scale + "x"
        absoluteTargetPath = absoluteTargetPath.replace(
          /\.svg$/i,
          scale + ".svg",
        )
      }

      let svgPromise: Promise<string | undefined> = Promise.resolve(
        tools.formatSvg(createIcon(
          icon.fileName ?? icon.filePath,
          iconModule,
          targetData,
        ) as string),
      )

      if (targetData.minify) {
        svgPromise = svgPromise
          .then(svg => svgo.optimize(svg as string))
          .then((result: any) => result.data)
      }

      return svgPromise
        .then(svg => fs.writeFile(absoluteTargetPath, svg as string))
        .then(() =>
          console.info(` - ${absoluteTargetPath} ${chalk.green("✔")}`),
        )
        .catch(console.error)
    })

    return Promise.all(targetWritePromises)
  })

  return Promise.all(writePromises)
}
