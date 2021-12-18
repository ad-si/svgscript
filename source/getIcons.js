import fs from "fs/promises"
import path from "path"

import createIcon from "./createIcon.js"


export default async function (absoluteIconsDirectoryPaths, iconOptions) {
  let fileNames

  if (absoluteIconsDirectoryPaths.length !== 1) {
    throw new Error("SvgScript currently only accepts 1 file or dir path")
  }

  let absoluteIconsDirectoryPath = absoluteIconsDirectoryPaths[0]

  const fileStats = await fs.stat(absoluteIconsDirectoryPath)
  const isFile = fileStats.isFile()

  if (isFile) {
    fileNames = [path.basename(absoluteIconsDirectoryPath)]
    absoluteIconsDirectoryPath = path.dirname(absoluteIconsDirectoryPath)
  }
  else {
    fileNames = await fs.readdir(absoluteIconsDirectoryPath)
  }

  return await Promise.allSettled(fileNames
    .filter(filePath => filePath.search(/.*\.m?js/) > -1)
    .map(async iconPath => {
      iconPath = path.join(absoluteIconsDirectoryPath, iconPath)
      let name = path.basename(
        iconPath,
        path.extname(iconPath),
      )

      name += /.*\.svg$/.test(name) ? "" : ".svg"

      try {
        const iconModule = await import(iconPath + `?version=${Math.random()}`)

        return {
          relativeFilePath: name,
          directoryName: absoluteIconsDirectoryPath,
          absoluteFilePath: path.join(absoluteIconsDirectoryPath, name),
          content: createIcon(name, iconModule, iconOptions),
        }
      }
      catch (error) {
        console.error(error.stack)
      }
    }))
}
