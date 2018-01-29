require('coffeescript/register')

const express = require('express')
const app = express()
const http = require('http')
const socketio = require('socket.io')
// const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const browserify = require('browserify-middleware')

const server = http.Server(app) // eslint-disable-line new-cap
const socketServer = socketio(server)


const svgScript = require('./index.js')
const projectRoot = path.resolve(__dirname, '..')
// const shavenJs = fs.readFileSync(
//   path.resolve(projectRoot, 'node_modules/shaven/shaven.js')
// )


// function handler (request, response) {
//   let returnHTML = ''
//   const iconsDirectory = ''
//
//   const indexHTML = fs.readFileSync(path.join(projectRoot, 'index.mustache'))
//   const styles = fs.readFileSync(path.join(projectRoot, 'public/screen.css'))
//   const content = svgScript
//     .getIcons(iconsDirectory)
//     .map(icon => {
//       return '<div class=icon id=' + icon.basename + '>' +
//         icon.content +
//         '</div>'
//     })
//     .join('')
//
//   if (request.url === '/favicon.ico') {
//     response.writeHead(404)
//   }
//   else if (request.url === '/') {
//     returnHTML = String(indexHTML)
//       .replace('{{styles}}', styles)
//       .replace('{{content}}', content)
//       .replace('{{scripts}}', shavenJs)
//
//     response.writeHead(200)
//     response.end(returnHTML)
//   }
//
//   // TODO: Single view of icons
//   // else if () {
//   //   request.writeHead(200)
//   //   request.end(fs.readFileSync(request.url))
//   // }
//
//   else {
//     response.writeHead(404)
//     response.end(request.url + ' is not available!')
//   }
// }


module.exports = (iconsDirectory) => {
  // eslint-disable-next-line no-console
  console.info('Watching', iconsDirectory, 'for changes')

  const port = 7992
  const watcherConfig = {
    ignored: /.+\.(?!js|coffee)\w+$/gim,
  }
  const watcher = chokidar.watch(path.resolve(iconsDirectory), watcherConfig)

  function compileIcon (iconPath) {
    delete require.cache[require.resolve(iconPath)]

    const basename = path.basename(iconPath, path.extname(iconPath))

    try {
      const svgModule = require(iconPath)
      return {
        basename: basename,
        content: svgScript.createIcon(basename, svgModule),
      }
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.stack)
    }
  }

  socketServer.on('connection', socket => {
    // eslint-disable-next-line no-console
    console.log('Websocket connection was established')

    watcher
      .on('change', iconPath => {
        if (iconPath.startsWith('.')) return
        // eslint-disable-next-line no-console
        console.log(iconPath, 'changed')
        socket.emit('icon', compileIcon(iconPath))
      })
      .on('error', error => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

    const watched = watcher.getWatched()

    Object
      .keys(watched)
      .reduce(
        (paths, currentDirectory) => {
          watched[currentDirectory].forEach(fileName => {
            paths.push(path.join(currentDirectory, fileName))
          })
          return paths
        },
        []
      )
      .filter(filePath => /\.(js|coffee)$/gi.test(filePath))
      .forEach(filePath =>
        socket.emit('icon', compileIcon(filePath))
      )
  })

  app.get('/', (request, response) =>
    response.sendFile(path.join(projectRoot, 'public/index.html'))
  )

  app.use('/scripts', browserify(path.join(projectRoot, 'public/scripts')))
  app.use(express.static(path.join(projectRoot, 'public')))

  server.listen(port, () =>
    // eslint-disable-next-line no-console
    console.log('SvgScript listens on http://localhost:' + port)
  )
}
