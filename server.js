require('coffee-script/register')

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

	iconsDirectory,
	watcher,
	indexHTML,
	styles,
	content


iconsDirectory = path.join(__dirname, 'icons', 'misc')

watcher = chokidar.watch(
	iconsDirectory,
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
		.getIcons(iconsDirectory)
		.map(function (icon) {
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


app.listen(port)
console.log('SvgScript listens on http://localhost:' + port)


io.on('connection', function (socket) {

	watcher
		.on('change', function (iconPath) {

			console.log(iconPath, 'changed')

			delete require.cache[require.resolve(iconPath)]

			var basename = path.basename(iconPath, path.extname(iconPath)),
				icon = {
					basename: basename,
					content: svgScript.createIcon(basename, require(iconPath))
				}

			socket.emit('icon', icon)
		})
		.on('error', function (error) {
			console.error('Error happened', error)
		})
})
