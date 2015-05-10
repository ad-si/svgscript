#! /usr/bin/env node

var fsp = require('fs-promise'),
	path = require('path'),
	chalk = require('chalk'),

	svgScript = require('../public/svgScript'),
	svgKit = require('../svgKit'),

	commandName = path.basename(process.argv[1]),
	args = process.argv.slice(2)


if (args[0] === 'compile') {

	svgScript
		.getIcons(path.resolve(process.cwd(), args[1]))
		.forEach(function (icon) {

			fsp
				.writeFile(icon.filePath, svgKit.formatSvg(icon.content))
				.then(function () {
					console.log(chalk.green('Created', icon.fileName))
				})
				.catch(function (error) {
					console.error(chalk.red(error))
				})
		})
}
else {

	console.error('Usage: ' + commandName + ' compile <path-to-file/dir>')

	process.exit(1)
}
