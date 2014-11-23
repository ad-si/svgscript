var shaven = require('shaven'),
	app = require('http').createServer(handler),
	io = require('socket.io')(app),
	fs = require('fs'),
	path = require('path'),
	chokidar = require('chokidar'),

	svgScript = require('./public/svgScript.js'),
	shavenJs = fs.readFileSync(
		path.join(__dirname, 'bower_components', 'shaven', 'shaven.js')
	),
	port = 3000,

	iconsDirectoryPath,
	watcher,
	indexHTML,
	styles,
	content


iconsDirectoryPath = path.join(__dirname, 'icons', 'misc')

watcher = chokidar.watch(
	iconsDirectoryPath,
	{
		ignored: /[\/\\]\./,
		persistent: true
	}
)


function handler (req, res) {

	var returnHTML = ''

	indexHTML = fs.readFileSync(path.join('.', 'index.mustache'))
	styles = fs.readFileSync(path.join('public', 'screen.css'))
	content = svgScript
		.getIcons(path.join(__dirname, 'icons', 'misc'))
		.map(function (icon) {
			return '<div class=icon id=' + icon.fileName + '>' +
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


app.listen(port)
console.log('SvgScript listens on http://localhost:' + port)

io.on('connection', function (socket) {
	watcher
		.on('change', function (iconPath) {

			delete require.cache[require.resolve(iconPath)]

			var fileName = path.basename(iconPath, '.js'),
				icon = {
					fileName: fileName,
					content: svgScript.createIcon(require(iconPath))
				}

			socket.emit('icon', icon)
		})
		.on('error', function (error) {
			console.error('Error happened', error)
		})
})
