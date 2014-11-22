var shaven = require('shaven'),
    app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs'),
    path = require('path'),
    chokidar = require('chokidar'),
    clone = require('clone'),
    iconsDirectoryPath = __dirname + '/icons/educatopia',
    fileNames,
    //fileNames = fs.readdirSync(iconsDirectoryPath),
    watcher = chokidar.watch(
	    iconsDirectoryPath,
	    {
		    ignored: /[\/\\]\./,
		    persistent: true
	    }
    ),
    shavenJs = fs.readFileSync(__dirname +
                               '/bower_components/shaven/shaven.js'),
    indexHTML


function handler (req, res) {

	var returnHTML = ''

	// TODO: Remove from handler for production
	indexHTML = fs.readFileSync(__dirname + '/index.mustache')
	indexHTML = String(indexHTML).replace('{{scripts}}', shavenJs)

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

function getIcons () {

	var icons = []

	fileNames = fs.readdirSync(iconsDirectoryPath)

	fileNames
		.filter(function (fileName) {
			return fileName.search(/.*\.(svg|js)/) > -1
		})
		.forEach(function (iconPath) {

			iconPath = iconsDirectoryPath + '/' + iconPath



			delete require.cache[require.resolve(iconPath)]

			icons.push({
				fileName: path.basename(iconPath, '.js'),
				content: createIcon(require(iconPath))
			})
		})

	return icons
}

function createIcon (module) {

	var showOrigin = false,
	    icon = module()

	if (typeof icon !== 'string') {

		// Add coordinate system
		if (showOrigin === true) {
			icon.push(
				['g', {
					style: 'fill: rgb(255,255,200);' +
					       'stroke: red;' +
					       'stroke-width: 1'},
					['line', {x1: 0, y1: -100, x2: 0, y2: 100}],
					['line', {x1: -100, y1: 0, x2: 100, y2: 0}],
				]
			)
		}

		icon = shaven(icon)[0]
	}

	return icon
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
