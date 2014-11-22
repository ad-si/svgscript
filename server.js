var shaven = require('shaven'),
	app = require('http').createServer(handler),
	io = require('socket.io')(app),
	fs = require('fs'),
	path = require('path'),
	chokidar = require('chokidar'),
	clone = require('clone'),
	iconsDirectoryPath = __dirname + '/icons/educatopia',
	fileNames, // = fs.readdirSync(iconsDirectoryPath),
	watcher = chokidar.watch(
		iconsDirectoryPath,
		{
			ignored: /[\/\\]\./,
			persistent: true
		}
	),
	shavenJs = fs.readFileSync(
		__dirname + '/bower_components/shaven/shaven.js'
	),
	indexHTML


function handler (req, res) {

	var returnHTML = ''

	// TODO: Remove from handler for production
	indexHTML = fs.readFileSync(path.join('public','index.html'))

	if (req.url === '/favicon.ico')
		res.writeHead(404)

	else if (req.url === '/') {
		returnHTML = String(indexHTML).replace(
			'{{content}}',
			getIcons()
				.map(function (icon) {
					return '<div class=icon id=' + icon.fileName + '>' +
					       icon.content +
					       '</div>'
				})
				.join('')
		)

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


app.listen(3000)

io.on('connection', function (socket) {
	watcher
		.on('change', function (iconPath) {

			delete require.cache[require.resolve(iconPath)]

			var fileName = path.basename(iconPath, '.js'),
				icon

			socket.emit('icon', {
				fileName: fileName,
				content: createIcon(require(iconPath))
			})
		})
		.on('error', function (error) {
			console.error('Error happened', error)
		})
})
