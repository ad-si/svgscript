'use strict'

require('coffee-script/register')

const shaven = require('shaven')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const socketio = require('socket.io')(server)
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const browserify = require('browserify-middleware')


const svgScript = require('./index.js')
const projectRoot = path.resolve(__dirname, '..')
const shavenJs = fs.readFileSync(
	path.resolve(projectRoot, 'node_modules/shaven/shaven.js')
)


function handler (req, res) {

	let returnHTML = ''

	const indexHTML = fs.readFileSync(path.join(projectRoot, 'index.mustache'))
	const styles = fs.readFileSync(path.join(projectRoot, 'public/screen.css'))
	const content = svgScript
		.getIcons(iconsDirectory)
		.map(icon => {
			return '<div class=icon id=' + icon.basename + '>' +
				icon.content +
				'</div>'
		})
		.join('')

	if (req.url === '/favicon.ico')
		res.writeHead(404)

	else if (req.url === '/') {
		returnHTML = String(indexHTML)
			.replace('{{styles}}', styles)
			.replace('{{content}}', content)
			.replace('{{scripts}}', shavenJs)

		res.writeHead(200)
		res.end(returnHTML)
	}

	// TODO: Single view of icons
	/*else if () {
	 req.writeHead(200)
	 req.end(fs.readFileSync(req.url))
	 }
	 */


	else {
		res.writeHead(404)
		res.end(req.url + ' is not available!')
	}
}


module.exports = (iconsDirectory) => {
	console.log('Watching', iconsDirectory, 'for changes')

	const port = 3000
	const watcherConfig = {
		ignored: /.+\.(?!js|coffee)\w+$/gim
	}
	const watcher = chokidar.watch(path.resolve(iconsDirectory), watcherConfig)

	function compileIcon (iconPath, socket) {
		delete require.cache[require.resolve(iconPath)]

		const basename = path.basename(iconPath, path.extname(iconPath))

		try {
			const svgModule = require(iconPath)
			return {
				basename: basename,
				content: svgScript.createIcon(basename, svgModule)
			}
		}
		catch (error) {
			console.error(error.stack)
		}
	}

	socketio.on('connection', socket => {
		console.log('Websocket connection was established')
		watcher
			.on('change', iconPath => {
				if (iconPath.startsWith('.'))
					return
				console.log(iconPath, 'changed')
				socket.emit('icon', compileIcon(iconPath))
			})
			.on('error', console.error)

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
		console.log('SvgScript listens on http://localhost:' + port)
	)
}
