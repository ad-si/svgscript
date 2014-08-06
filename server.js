var shaven = require('shaven'),
    app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs'),
    path = require('path'),
    chokidar = require('chokidar'),
    clone = require('clone'),
    iconsDirectoryPath = __dirname + '/icons',
    fileNames = fs.readdirSync(iconsDirectoryPath),
    watcher = chokidar.watch(
	    iconsDirectoryPath,
	    {
		    ignored: /[\/\\]\./,
		    persistent: true
	    }
    ),
    shavenJs = fs
	    .readFileSync(__dirname + '/bower_components/shaven/shaven.min.js'),
    indexHTML


function handler (req, res) {

	var returnHTML = ''

	// TODO: Remove from handler for production
	indexHTML = fs.readFileSync(__dirname + '/index.mustache')
	indexHTML = String(indexHTML).replace('{{scripts}}', shavenJs)

	if (req.url === '/favicon.ico')
		res.writeHead(200)

	else {
		returnHTML = String(indexHTML)
			.replace(
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
}

function getIcons (rendered) {

	var icons = []

	fileNames = fs.readdirSync(iconsDirectoryPath)

	fileNames.forEach(function (iconPath) {

		var iconModule,
		    icon

		iconPath = iconsDirectoryPath + '/' + iconPath

		delete require.cache[require.resolve(iconPath)]

		iconModule = require(iconPath)

		if (typeof icon !== 'string')
			icon = shaven(clone(iconModule()))[0]

		icons.push({
			fileName: path.basename(iconPath, '.js'),
			content: icon
		})
	})

	return icons
}


app.listen(3000)

io.on('connection', function (socket) {
	watcher
		.on('change', function (iconPath) {

			delete require.cache[require.resolve(iconPath)]

			var fileName = path.basename(iconPath, '.js'),
			    iconModule = require(iconPath)

			socket.emit('icon', {
				fileName: fileName,
				content: shaven(iconModule())[0]
			})
		})
		.on('error', function (error) {
			console.error('Error happened', error)
		})
})
