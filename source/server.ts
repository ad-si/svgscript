import path from "path"
import http from "http"

import * as socketio from "socket.io"
import chokidar from "chokidar"
import browserify from "browserify-middleware"
import express from "express"
const app = express()

const server = http.createServer(app)
const socketServer = new socketio.Server(server)

import * as svgScript from "./index.js"
import {IconModule} from "./createIcon.js"

const moduleURL = new URL(import.meta.url)
const __dirname = path.dirname(moduleURL.pathname)
const projectRoot = path.resolve(__dirname, "..")


export default async (paths: string[]) => {

  if (paths.length !== 1) {
    throw new Error("SvgScript currently only accepts 1 file or dir path")
  }

  const iconDirectory = paths[0]

  console.info(`Watching "${paths}" for changes`)

  const port = 7992
  const watcherConfig = {
    ignored: /.+\.(?!m?js)\w+$/gim,
  }
  const watcher = chokidar.watch(path.resolve(iconDirectory), watcherConfig)

  async function compileIcon (iconPath: string) {
    const basename = path.basename(iconPath, path.extname(iconPath))

    try {
      const svgModule = await import(
        iconPath + `?version=${Math.random()}`
      ) as IconModule
      return {
        basename: basename,
        content: svgScript.createIcon(basename, svgModule),
      }
    }
    catch (error) {
      console.error((error as Error).stack)
      return undefined
    }
  }

  socketServer.on("connection", async socket => {
    console.info("Websocket connection was established")

    watcher
      .on("change", async iconPath => {
        if (iconPath.startsWith(".")) return
        console.info(iconPath, "changed")
        socket.emit("icon", await compileIcon(iconPath))
      })
      .on("error", error => {
        console.error(error)
      })

    const watched = watcher.getWatched()

    Object
      .keys(watched)
      .reduce<string[]>(
        (filesPaths, currentDirectory) => {
          watched[currentDirectory].forEach(fileName => {
            filesPaths.push(path.join(currentDirectory, fileName))
          })
          return filesPaths
        },
        [],
      )
      .filter(filePath => /\.m?js$/gi.test(filePath))
      .forEach(async filePath =>
        socket.emit("icon", await compileIcon(filePath)),
      )
  })

  app.get("/", (request, response) =>
    response.sendFile(path.join(projectRoot, "public/index.html")),
  )

  app.use("/scripts", browserify(path.join(projectRoot, "public/scripts")))
  app.use(express.static(path.join(projectRoot, "public")))

  server.listen(port, () =>
    console.info("SvgScript listens on http://localhost:" + port),
  )
}
